import { Generated } from 'kysely';
import { CategoryType } from '../../domains/movie/types/categoryType';

export interface MovieTable {
  id: Generated<string>;
  title: string;
  category: CategoryType;
  releaseDate: Date;
  createdAt: Generated<Date>;
  updatedAt: Generated<Date>;
  deletedAt: Generated<Date>;
}
