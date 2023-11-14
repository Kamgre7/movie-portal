import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('actors_movies')
    .addColumn('actorId', 'uuid', (col) =>
      col.references('actors.id').notNull()
    )
    .addColumn('movieId', 'uuid', (col) =>
      col.references('movies.id').notNull()
    )
    .addPrimaryKeyConstraint('actors_movies_key', ['actorId', 'movieId'])
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('actors_movies').execute();
}
