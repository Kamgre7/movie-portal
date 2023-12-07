import { Generated } from 'kysely';
import { GenderType } from '../../domains/user/types/genderType';
import { RoleType } from '../../domains/user/types/userRole';

export interface UsersTable {
  id: Generated<string>;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  gender: GenderType;
  role: Generated<RoleType>;
  createdAt: Generated<Date>;
  updatedAt: Generated<Date>;
  deletedAt: Generated<Date>;
}
