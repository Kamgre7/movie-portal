import { Generated } from 'kysely';
import { GenderType } from '../../domains/user/types/genderType';

export interface ActorsTable {
  id: Generated<string>;
  firstName: string;
  lastName: string;
  gender: GenderType;
  createdAt: Generated<Date>;
  updatedAt: Generated<Date>;
  deletedAt: Generated<Date>;
}
