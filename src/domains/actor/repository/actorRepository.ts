import { inject, injectable } from 'inversify';
import { Actor, IActorModel } from '../models/actorModel';
import { NewActor } from '../schemas/createActorSchema';
import { database } from '../../../database/database';
import { TYPES } from '../../../ioc/types/types';
import { IErrorMapper } from '../../../errors/errorMapper';

export interface IActorRepository {
  findById(id: string): Promise<IActorModel | undefined>;
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
      .selectFrom('actor')
      .where('id', '=', id)
      .selectAll()
      .executeTakeFirst();

    return actor
      ? [actor].map((actorModel) => new Actor(actorModel))[0]
      : undefined;
  }

  async create(newActor: NewActor): Promise<IActorModel> {
    try {
      const actor = await this.db
        .insertInto('actor')
        .values(newActor)
        .returningAll()
        .executeTakeFirstOrThrow();

      return [actor].map((actorModel) => new Actor(actorModel))[0];
    } catch (err: any) {
      throw this.errorMapper.mapRepositoryError(err);
    }
  }
}
