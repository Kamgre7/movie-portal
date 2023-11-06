import { injectable } from 'inversify';
import { Actor, IActorModel } from '../models/actorModel';
import { NewActor } from '../schemas/createActorSchema';
import { database } from '../../../database/database';
import { BadRequestError } from '../../../errors/badRequestError';
import { DbError, DbErrorCodes } from '../../../errors/dbError';

export interface IActorRepository {
  findById(id: string): Promise<IActorModel | undefined>;
  create(newActor: NewActor): Promise<IActorModel>;
}

@injectable()
export class ActorRepository implements IActorRepository {
  constructor(private readonly db = database) {}

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
      throw this.mapError(err);
    }
  }

  private mapError(err: any): BadRequestError | DbError {
    if (err.code === DbErrorCodes.UNIQUE_CONSTRAINT_VIOLATION) {
      return new BadRequestError(err.detail);
    }

    if (err.code === DbErrorCodes.NOT_NULL_VIOLATION) {
      return new BadRequestError(err.detail);
    }

    return new DbError(err.detail);
  }
}
