import * as dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

export const DbSchema = z.object({
  dbName: z.string().min(1),
  dbHost: z.string().min(1),
  dbUser: z.string().min(1),
  dbPassword: z.string().min(1),
  dbPort: z.coerce.number(),
});

export const dbConfig = DbSchema.parse({
  dbHost: process.env.DB_HOST,
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,
  dbName: process.env.DB_NAME,
  dbPort: process.env.DB_PORT,
});
