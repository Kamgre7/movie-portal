import { Kysely, sql } from 'kysely';
import { SEX } from '../../domains/user/types/sexType';
import { CATEGORY } from '../../domains/movie/types/categoryType';

export const genderTypeInit = async (db: Kysely<any>) => {
  const existingTypes =
    await sql`SELECT typname FROM pg_type WHERE typname = 'UserGender'`.execute(
      db
    );

  if (existingTypes.rows.length === 0) {
    await db.schema
      .createType('UserGender')
      .asEnum([SEX.FEMALE, SEX.MALE])
      .execute();
  }
};

export const categoryTypeInit = async (db: Kysely<any>) => {
  const existingTypes =
    await sql`SELECT typname FROM pg_type WHERE typname = 'MovieCategory'`.execute(
      db
    );

  if (existingTypes.rows.length === 0) {
    await db.schema
      .createType('MovieCategory')
      .asEnum([
        CATEGORY.ACTION,
        CATEGORY.COMEDY,
        CATEGORY.DRAMA,
        CATEGORY.FANTASY,
        CATEGORY.THRILLER,
      ])
      .execute();
  }
};
