import { Generated } from 'kysely';
import { SexType } from '../../domains/user/types/sexType';

export interface ActorTable {
  id: Generated<string>;
  firstName: string;
  lastName: string;
  gender: SexType;
  createdAt: Generated<Date>;
  updatedAt: Generated<Date>;
  deletedAt: Generated<Date>;
}
