import { inject, injectable } from 'inversify';
import { TYPES } from '../../../ioc/types/types';
import { IErrorMapper } from '../../../errors/errorMapper';
import { database } from '../../../database/database';
import { ActorRating, IActorRatingModel } from '../models/actorRating';

export type ActorInMovieRating = {
  userId: string;
  movieId: string;
  rating: number;
  actorId: string;
};

export interface IActorRatingRepository {
  rate(actorRateInfo: ActorInMovieRating): Promise<IActorRatingModel>;
  find(actorId: string): Promise<IActorRatingModel[]>;
  update(actorRateInfo: ActorInMovieRating): Promise<IActorRatingModel>;
}

@injectable()
export class ActorRatingRepository implements IActorRatingRepository {
  private readonly actorsRatingTable = 'users_actors_ratings';

  constructor(
    @inject(TYPES.ErrorMapperToken)
    private readonly errorMapper: IErrorMapper,
    private readonly db = database
  ) {}

  async rate(rateInfo: ActorInMovieRating): Promise<IActorRatingModel> {
    try {
      const rate = await this.db
        .insertInto(this.actorsRatingTable)
        .values(rateInfo)
        .returningAll()
        .executeTakeFirstOrThrow();

      return ActorRating.createFromDB(rate);
    } catch (err) {
      throw this.errorMapper.mapRepositoryError(err);
    }
  }

  async find(actorId: string): Promise<IActorRatingModel[]> {
    const ratings = await this.db
      .selectFrom(this.actorsRatingTable)
      .where('actorId', '=', actorId)
      .selectAll()
      .execute();

    return ratings.map((rating) => ActorRating.createFromDB(rating));
  }

  async update(actorRateInfo: ActorInMovieRating): Promise<IActorRatingModel> {
    const { actorId, movieId, rating, userId } = actorRateInfo;

    try {
      const updatedRating = await this.db
        .updateTable(this.actorsRatingTable)
        .set({ rating })
        .where('users_actors_ratings.movieId', '=', movieId)
        .where('users_actors_ratings.actorId', '=', actorId)
        .where('users_actors_ratings.userId', '=', userId)
        .returningAll()
        .executeTakeFirstOrThrow();

      return ActorRating.createFromDB(updatedRating);
    } catch (err) {
      throw this.errorMapper.mapRepositoryError(err);
    }
  }
}
