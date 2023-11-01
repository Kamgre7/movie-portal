import { Generated } from 'kysely';
import { SexType } from '../../domains/user/types/sexType';

export interface UserTable {
  id: Generated<string>;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  gender: SexType;
  createdAt: Generated<Date>;
  updatedAt: Generated<Date>;
  deletedAt: Generated<Date>;
}
