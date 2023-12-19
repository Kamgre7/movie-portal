import { Client } from 'pg';
import { DbConfig, dbConfig } from '../../config/dbConfig';

async function createDbIfNotExist(dbInfo: DbConfig) {
  const client = new Client({
    host: dbInfo.dbHost,
    user: dbInfo.dbUser,
    password: dbInfo.dbPassword,
    port: dbInfo.dbPort,
  });

  await client.connect();

  const res = await client.query(
    `SELECT datname FROM pg_catalog.pg_database WHERE datname = '${dbInfo.dbName}'`
  );

  if (res.rowCount === 0) {
    console.log(`${dbInfo.dbName} database not found, creating it.`);
    await client.query(`CREATE DATABASE "${dbInfo.dbName}";`);
    console.log(`created database ${dbInfo.dbName}.`);
  } else {
    console.log(`${dbInfo.dbName} database already exists.`);
  }

  await client.end();
}

createDbIfNotExist(dbConfig);
