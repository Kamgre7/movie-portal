import * as dotenv from 'dotenv';
import { z } from 'zod';
import { DbConfig } from '../config/dbConfig';
import { Client } from 'pg';

dotenv.config({
  path: './.env.jest',
});

async function createDbIfNotExist(dbInfo: DbConfig) {
  const client = new Client({
    host: dbInfo.dbHost,
    user: dbInfo.dbUser,
    password: dbInfo.dbPassword,
    port: dbInfo.dbPort,
  });

  await client.connect();

  const res = await client.query(`SELECT datname FROM pg_catalog.pg_database WHERE datname = '${dbInfo.dbName}'`);

  if (res.rowCount === 0) {
    console.log(`${dbInfo.dbName} database not found, creating it.`);
    await client.query(`CREATE DATABASE "${dbInfo.dbName}";`);
    console.log(`created database ${dbInfo.dbName}.`);
  } else {
    console.log(`${dbInfo.dbName} database already exists.`);
  }

  await client.end();
}

const TestDbSchema = z.object({
  dbName: z.string().min(1),
  dbHost: z.string().min(1),
  dbUser: z.string().min(1),
  dbPassword: z.string().min(1),
  dbPort: z.coerce.number(),
});

export const testDbConfig = TestDbSchema.parse({
  dbHost: process.env.DB_HOST,
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,
  dbName: process.env.DB_NAME,
  dbPort: Number(process.env.DB_PORT),
});

createDbIfNotExist(testDbConfig);
