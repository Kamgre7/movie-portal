import { inject, injectable } from 'inversify';
import { NewActor } from '../schemas/createActorValidationSchema';
import { database } from '../../../database/database';
import { TYPES } from '../../../ioc/types/types';
import { IErrorMapper } from '../../../errors/errorMapper';
import { ActorCriteria } from '../schemas/findActorValidationSchema';
import { Actor, IActorModel } from '../models/actor';
import { IActorRatingRepository } from './actorRatingRepository';

export interface IActorRepository {
  findById(id: string, withRating: boolean): Promise<IActorModel | null>;
  findByCriteria(criteria: ActorCriteria, withRating: boolean): Promise<IActorModel[]>;
  create(newActor: NewActor): Promise<IActorModel>;
}

@injectable()
export class ActorRepository implements IActorRepository {
  private readonly actorsTable = 'actors';

  constructor(
    @inject(TYPES.ErrorMapperToken)
    private readonly errorMapper: IErrorMapper,
    @inject(TYPES.ActorRatingRepositoryToken)
    private readonly actorRatingRepository: IActorRatingRepository,
    private readonly db = database,
  ) {}

  async findById(id: string, withRating: boolean): Promise<IActorModel | null> {
    const actor = await this.db.selectFrom(this.actorsTable).where('id', '=', id).selectAll().executeTakeFirst();

    if (!actor) {
      return null;
    }

    if (withRating) {
      const rating = await this.actorRatingRepository.find(actor.id);

      return Actor.createWithRating(actor, rating);
    }

    return Actor.createBasic(actor);
  }

  async findByCriteria(criteria: ActorCriteria, withRating: boolean): Promise<IActorModel[]> {
    const { firstName, lastName } = criteria;

    let query = this.db.selectFrom(this.actorsTable);

    if (firstName) query = query.where('firstName', 'ilike', `%${firstName}%`);
    if (lastName) query = query.where('lastName', 'ilike', `%${lastName}%`);

    const actors = await query.selectAll().execute();

    if (withRating) {
      const actorsRating = await Promise.all(actors.map((actor) => this.actorRatingRepository.find(actor.id)));

      return actors.map((actor, index) => Actor.createWithRating(actor, actorsRating[index]));
    }

    return actors.map((actor) => Actor.createBasic(actor));
  }

  async create(newActor: NewActor): Promise<IActorModel> {
    try {
      const actor = await this.db
        .insertInto(this.actorsTable)
        .values(newActor)
        .returningAll()
        .executeTakeFirstOrThrow();

      return Actor.createBasic(actor);
    } catch (err) {
      throw this.errorMapper.mapRepositoryError(err);
    }
  }
}
