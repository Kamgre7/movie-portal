import { Kysely, sql } from 'kysely';
import { genderTypeInit } from '../scripts/dbTypesInit';

export async function up(db: Kysely<any>): Promise<void> {
  await genderTypeInit(db);

  await db.schema
    .createTable('actor')
    .addColumn('id', 'uuid', (col) =>
      col
        .primaryKey()
        .unique()
        .defaultTo(sql`gen_random_uuid()`)
    )
    .addColumn('firstName', 'varchar', (col) => col.notNull())
    .addColumn('lastName', 'varchar', (col) => col.notNull())
    .addColumn('gender', sql`"UserGender"`)
    .addColumn('createdAt', 'timestamp', (col) => col.defaultTo(sql`now()`))
    .addColumn('updatedAt', 'timestamp', (col) => col.defaultTo(sql`now()`))
    .addColumn('deletedAt', 'timestamp', (col) => col.defaultTo(null))
    .execute();

  await db.schema
    .createTable('actor_movie')
    .addColumn('actorId', 'uuid', (col) => col.references('actor.id').notNull())
    .addColumn('movieId', 'uuid', (col) => col.references('movie.id').notNull())
    .addPrimaryKeyConstraint('primary_key', ['actorId', 'movieId'])
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('actor').execute();
  await db.schema.dropTable('actor_movie').execute();
}
