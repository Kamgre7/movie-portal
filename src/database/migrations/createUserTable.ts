import { Kysely, sql } from 'kysely';
import { genderTypeInit } from '../scripts/dbTypesInit';

export async function up(db: Kysely<any>): Promise<void> {
  await genderTypeInit(db);

  await db.schema
    .createTable('user')
    .addColumn('id', 'uuid', (col) =>
      col
        .primaryKey()
        .unique()
        .defaultTo(sql`gen_random_uuid()`)
    )
    .addColumn('email', 'varchar(50)', (col) => col.unique().notNull())
    .addColumn('firstName', 'varchar', (col) => col.notNull())
    .addColumn('lastName', 'varchar', (col) => col.notNull())
    .addColumn('password', 'varchar', (col) => col.notNull())
    .addColumn('gender', sql`"UserGender"`)
    .addColumn('createdAt', 'timestamp', (col) => col.defaultTo(sql`now()`))
    .addColumn('updatedAt', 'timestamp', (col) => col.defaultTo(sql`now()`))
    .addColumn('deletedAt', 'timestamp', (col) => col.defaultTo(null))
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('user').execute();
}
