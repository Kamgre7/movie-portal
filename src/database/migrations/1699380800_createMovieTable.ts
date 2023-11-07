import { Kysely, sql } from 'kysely';
import { categoryTypeInit } from '../scripts/dbTypesInit';

export async function up(db: Kysely<any>): Promise<void> {
  await categoryTypeInit(db);

  await db.schema
    .createTable('movie')
    .addColumn('id', 'uuid', (col) =>
      col
        .primaryKey()
        .unique()
        .defaultTo(sql`gen_random_uuid()`)
    )
    .addColumn('title', 'varchar(50)', (col) => col.unique().notNull())
    .addColumn('category', sql`"MovieCategory"`)
    .addColumn('releaseDate', 'timestamp', (col) => col.notNull())
    .addColumn('createdAt', 'timestamp', (col) => col.defaultTo(sql`now()`))
    .addColumn('updatedAt', 'timestamp', (col) => col.defaultTo(sql`now()`))
    .addColumn('deletedAt', 'timestamp', (col) => col.defaultTo(null))
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('movie').execute();
}
