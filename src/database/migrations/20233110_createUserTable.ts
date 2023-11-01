import { Kysely, sql } from 'kysely';
import { v4 as uuid } from 'uuid';
import { SEX } from '../../domains/user/types/sexType';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createType('UserGender')
    .asEnum([SEX.FEMALE, SEX.MALE])
    .execute();

  await db.schema
    .createTable('user')
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().unique().defaultTo(uuid())
    )
    .addColumn('email', 'varchar(50)', (col) => col.unique().notNull())
    .addColumn('firstName', 'varchar', (col) => col.notNull())
    .addColumn('lastName', 'varchar', (col) => col.notNull())
    .addColumn('password', 'varchar', (col) => col.notNull())
    .addColumn('gender', sql`"UserGender"`)
    .addColumn('createdAt', 'timestamp', (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .addColumn('updatedAt', 'timestamp', (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .addColumn('deletedAt', 'timestamp', (col) => col.defaultTo(null))
    .execute();
}

export async function userTableDown(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('user').execute();
}
