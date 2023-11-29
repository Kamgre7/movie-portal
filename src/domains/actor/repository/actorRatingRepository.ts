import { inject, injectable } from 'inversify';
import { TYPES } from '../../../ioc/types/types';
import { IErrorMapper } from '../../../errors/errorMapper';
import { database } from '../../../database/database';

export type ActorInMovieRating = {
  userId: string;
  movieId: string;
  rating: number;
  actorId: string;
};

export interface IActorRatingRepository {
  rate(actorRateInfo: ActorInMovieRating): Promise<ActorInMovieRating>;
  find(actorId: string): Promise<ActorInMovieRating[]>;
  update(actorRateInfo: ActorInMovieRating): Promise<ActorInMovieRating>;
}

@injectable()
export class ActorRatingRepository implements IActorRatingRepository {
  private readonly actorsRatingTable = 'users_actors_ratings';

  constructor(
    @inject(TYPES.ErrorMapperToken)
    private readonly errorMapper: IErrorMapper,
    private readonly db = database
  ) {}

  async rate(rateInfo: ActorInMovieRating): Promise<ActorInMovieRating> {
    try {
      const rate = await this.db
        .insertInto(this.actorsRatingTable)
        .values(rateInfo)
        .returningAll()
        .executeTakeFirstOrThrow();

      return rate;
    } catch (err) {
      throw this.errorMapper.mapRepositoryError(err);
    }
  }

  async find(actorId: string): Promise<ActorInMovieRating[]> {
    const ratings = await this.db
      .selectFrom(this.actorsRatingTable)
      .where('actorId', '=', actorId)
      .selectAll()
      .execute();

    return ratings;
  }

  async update(actorRateInfo: ActorInMovieRating): Promise<ActorInMovieRating> {
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

      return updatedRating;
    } catch (err) {
      throw this.errorMapper.mapRepositoryError(err);
    }
  }
}
