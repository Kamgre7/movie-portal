import { Client } from 'pg';
import { dbConfig } from '../../config/dbConfig';

export async function createDbIfNotExist() {
  const client = new Client({
    host: dbConfig.dbHost,
    user: dbConfig.dbUser,
    password: dbConfig.dbPassword,
    port: dbConfig.dbPort,
  });

  await client.connect();

  const res = await client.query(
    `SELECT datname FROM pg_catalog.pg_database WHERE datname = '${dbConfig.dbName}'`
  );

  if (res.rowCount === 0) {
    console.log(`${dbConfig.dbName} database not found, creating it.`);
    await client.query(`CREATE DATABASE "${dbConfig.dbName}";`);
    console.log(`created database ${dbConfig.dbName}.`);
  } else {
    console.log(`${dbConfig.dbName} database already exists.`);
  }

  await client.end();
}
