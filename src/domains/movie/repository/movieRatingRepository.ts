import { inject, injectable } from 'inversify';
import { TYPES } from '../../../ioc/types/types';
import { IErrorMapper } from '../../../errors/errorMapper';
import { database } from '../../../database/database';

export type MovieRatingData = {
  userId: string;
  movieId: string;
  rating: number;
};

export interface IMovieRatingRepository {
  rate(movieRating: MovieRatingData): Promise<MovieRatingData>;
  update(movieRating: MovieRatingData): Promise<MovieRatingData>;
  find(movieId: string): Promise<MovieRatingData[]>;
}

@injectable()
export class MovieRatingRepository implements IMovieRatingRepository {
  private readonly movieRatingTable = 'users_movies_ratings';

  constructor(
    @inject(TYPES.ErrorMapperToken)
    private readonly errorMapper: IErrorMapper,
    private readonly db = database
  ) {}

  async rate(movieRating: MovieRatingData): Promise<MovieRatingData> {
    try {
      const rate = await this.db
        .insertInto(this.movieRatingTable)
        .values(movieRating)
        .returningAll()
        .executeTakeFirstOrThrow();

      return rate;
    } catch (err) {
      throw this.errorMapper.mapRepositoryError(err);
    }
  }

  async find(movieId: string): Promise<MovieRatingData[]> {
    const ratings = await this.db
      .selectFrom(this.movieRatingTable)
      .where('movieId', '=', movieId)
      .selectAll()
      .execute();

    return ratings;
  }

  async update(movieRating: MovieRatingData): Promise<MovieRatingData> {
    const { movieId, rating, userId } = movieRating;

    try {
      const updatedRating = await this.db
        .updateTable(this.movieRatingTable)
        .set({ rating })
        .where('movieId', '=', movieId)
        .where('userId', '=', userId)
        .returningAll()
        .executeTakeFirstOrThrow();

      return updatedRating;
    } catch (err) {
      throw this.errorMapper.mapRepositoryError(err);
    }
  }
}
