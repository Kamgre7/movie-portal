import { inject, injectable } from 'inversify';
import { NewActor } from '../schemas/createActorValidationSchema';
import { database } from '../../../database/database';
import { TYPES } from '../../../ioc/types/types';
import { IErrorMapper } from '../../../errors/errorMapper';
import { ActorCriteria } from '../schemas/findActorValidationSchema';
import { GenderType } from '../../user/types/genderType';

export type ActorFromDB = {
  id: string;
  firstName: string;
  lastName: string;
  gender: GenderType;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
};

export interface IActorRepository {
  findById(id: string): Promise<ActorFromDB | null>;
  findByCriteria(criteria: ActorCriteria): Promise<ActorFromDB[]>;
  create(newActor: NewActor): Promise<ActorFromDB>;
}

@injectable()
export class ActorRepository implements IActorRepository {
  private readonly actorsTable = 'actors';

  constructor(
    @inject(TYPES.ErrorMapperToken)
    private readonly errorMapper: IErrorMapper,
    private readonly db = database
  ) {}

  async findById(id: string): Promise<ActorFromDB | null> {
    const actor = await this.db
      .selectFrom(this.actorsTable)
      .where('id', '=', id)
      .selectAll()
      .executeTakeFirst();

    return actor ?? null;
  }

  async findByCriteria(criteria: ActorCriteria): Promise<ActorFromDB[]> {
    const { firstName, lastName } = criteria;

    let query = this.db.selectFrom(this.actorsTable);

    if (firstName) query = query.where('firstName', 'ilike', `%${firstName}%`);
    if (lastName) query = query.where('lastName', 'ilike', `%${lastName}%`);

    const actors = await query.selectAll().execute();

    return actors;
  }

  async create(newActor: NewActor): Promise<ActorFromDB> {
    try {
      const actor = await this.db
        .insertInto(this.actorsTable)
        .values(newActor)
        .returningAll()
        .executeTakeFirstOrThrow();

      return actor;
    } catch (err) {
      throw this.errorMapper.mapRepositoryError(err);
    }
  }
}
