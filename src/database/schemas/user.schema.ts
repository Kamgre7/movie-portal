import {
  ColumnType,
  Generated,
  Insertable,
  Selectable,
  Updateable,
} from 'kysely';
import { SexType } from '../../domains/user/types/sexType';

export interface UserTable {
  id: Generated<string>;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  passwordSalt: string;
  gender: SexType;
  createdAt: ColumnType<Date, never, never>;
  updatedAt: ColumnType<Date, never, string>;
  deletedAt: ColumnType<Date, never, string>;
}

export type User = Selectable<UserTable>;
export type NewUser = Insertable<UserTable>;
export type UpdateUser = Updateable<UserTable>;
