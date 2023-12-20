import { Kysely, PostgresDialect } from 'kysely';
import { Database } from '../database/schemas/database.schema';
import { Pool } from 'pg';
import { testDbConfig } from './testDbInit';

export const testDb = new Kysely<Database>({
  dialect: new PostgresDialect({
    pool: new Pool({
      database: testDbConfig.dbName,
      host: testDbConfig.dbHost,
      user: testDbConfig.dbUser,
      port: testDbConfig.dbPort,
      password: testDbConfig.dbPassword,
    }),
  }),
});
