import { inject, injectable } from 'inversify';
import { Actor, IActorModel } from '../models/actor';
import { NewActor } from '../schemas/createActorValidationSchema';
import { database } from '../../../database/database';
import { TYPES } from '../../../ioc/types/types';
import { IErrorMapper } from '../../../errors/errorMapper';
import { ActorCriteria } from '../schemas/findActorValidationSchema';

export interface IActorRepository {
  findById(id: string): Promise<IActorModel | undefined>;
  findByCriteria(criteria: ActorCriteria): Promise<IActorModel[]>;
  create(newActor: NewActor): Promise<IActorModel>;
}

@injectable()
export class ActorRepository implements IActorRepository {
  constructor(
    @inject(TYPES.ErrorMapperToken)
    private readonly errorMapper: IErrorMapper,
    private readonly db = database
  ) {}

  async findById(id: string): Promise<IActorModel | undefined> {
    const actor = await this.db
      .selectFrom('actors')
      .where('id', '=', id)
      .selectAll()
      .executeTakeFirst();

    return actor ? Actor.createFromDB(actor) : undefined;
  }

  async findByCriteria(criteria: ActorCriteria): Promise<IActorModel[]> {
    const { firstName, lastName } = criteria;

    let query = this.db.selectFrom('actors');

    if (firstName) query = query.where('firstName', 'ilike', `%${firstName}%`);
    if (lastName) query = query.where('lastName', 'ilike', `%${lastName}%`);

    const actors = await query.selectAll().execute();

    return actors.map((actor) => Actor.createFromDB(actor));
  }

  async create(newActor: NewActor): Promise<IActorModel> {
    try {
      const actor = await this.db
        .insertInto('actors')
        .values(newActor)
        .returningAll()
        .executeTakeFirstOrThrow();

      return Actor.createFromDB(actor);
    } catch (err) {
      throw this.errorMapper.mapRepositoryError(err);
    }
  }
}
