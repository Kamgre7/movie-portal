import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('users_movies_watchList')
    .addColumn('userId', 'uuid', (col) => col.references('users.id').notNull())
    .addColumn('movieId', 'uuid', (col) => col.references('movies.id').notNull())
    .addPrimaryKeyConstraint('users_movies_watchList_key', ['movieId', 'userId'])
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('users_movies_watchList').execute();
}
