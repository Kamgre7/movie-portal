import { Generated } from 'kysely';
import { GenderType } from '../../domains/user/types/genderType';

export interface UsersTable {
  id: Generated<string>;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  gender: GenderType;
  createdAt: Generated<Date>;
  updatedAt: Generated<Date>;
  deletedAt: Generated<Date>;
}
