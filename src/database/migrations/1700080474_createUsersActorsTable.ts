import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('users_actors_ratings')
    .addColumn('userId', 'uuid', (col) => col.references('users.id').notNull())
    .addColumn('movieId', 'uuid', (col) => col.references('movies.id').notNull())
    .addColumn('actorId', 'uuid', (col) => col.references('actors.id').notNull())
    .addColumn('rating', 'integer', (col) => col.notNull())
    .addPrimaryKeyConstraint('users_movies_actors_key', ['movieId', 'userId', 'actorId'])
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('users_actors_ratings').execute();
}
