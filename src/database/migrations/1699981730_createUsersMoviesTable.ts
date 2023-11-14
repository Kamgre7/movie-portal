import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('users_movies_ratings')
    .addColumn('movieId', 'uuid', (col) =>
      col.references('movies.id').notNull()
    )
    .addColumn('userId', 'uuid', (col) => col.references('users.id').notNull())
    .addColumn('rating', 'integer', (col) => col.notNull())
    .addPrimaryKeyConstraint('users_movies_key', ['movieId', 'userId'])
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('users_movies_ratings').execute();
}
