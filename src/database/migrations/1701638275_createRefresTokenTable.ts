import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('users_refresh_token')
    .addColumn('userId', 'uuid', (col) => col.references('users.id').notNull())
    .addColumn('token', 'varchar', (col) => col.defaultTo(null))
    .addColumn('expireAt', 'timestamp', (col) => col.defaultTo(null))
    .addColumn('createdAt', 'timestamp', (col) => col.defaultTo(null))
    .addPrimaryKeyConstraint('users_refreshToken_key', ['userId'])
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('users_refresh_token').execute();
}
