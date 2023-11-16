import { Kysely, sql } from 'kysely';
import { CATEGORY } from '../../domains/movie/types/categoryType';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createType('MovieCategory')
    .asEnum([CATEGORY.ACTION, CATEGORY.COMEDY, CATEGORY.DRAMA, CATEGORY.FANTASY, CATEGORY.THRILLER])
    .execute();

  await db.schema
    .createTable('movies')
    .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('title', 'varchar(50)', (col) => col.unique().notNull())
    .addColumn('category', sql`"MovieCategory"`, (col) => col.notNull())
    .addColumn('releaseDate', 'timestamp', (col) => col.notNull())
    .addColumn('createdAt', 'timestamp', (col) => col.defaultTo(sql`now()`))
    .addColumn('updatedAt', 'timestamp', (col) => col.defaultTo(sql`now()`))
    .addColumn('deletedAt', 'timestamp', (col) => col.defaultTo(null))
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('movies').execute();
}
