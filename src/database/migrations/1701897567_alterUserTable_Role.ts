import { Kysely, sql } from 'kysely';
import { ROLE } from '../../domains/user/types/userRole';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema.createType('UserRole').asEnum([ROLE.ADMIN, ROLE.USER]).execute();

  await db.schema
    .alterTable('users')
    .addColumn('role', sql`"UserRole"`, (col) => col.defaultTo(ROLE.USER))
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable('users').dropColumn('role').execute();
}
