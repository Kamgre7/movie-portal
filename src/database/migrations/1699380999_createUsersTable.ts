import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('users')
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`)
    )
    .addColumn('email', 'varchar(50)', (col) => col.unique().notNull())
    .addColumn('firstName', 'varchar(20)', (col) => col.notNull())
    .addColumn('lastName', 'varchar(20)', (col) => col.notNull())
    .addColumn('password', 'varchar', (col) => col.notNull())
    .addColumn('gender', sql`"GenderType"`, (col) => col.notNull())
    .addColumn('createdAt', 'timestamp', (col) => col.defaultTo(sql`now()`))
    .addColumn('updatedAt', 'timestamp', (col) => col.defaultTo(sql`now()`))
    .addColumn('deletedAt', 'timestamp', (col) => col.defaultTo(null))
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('users').execute();
}
