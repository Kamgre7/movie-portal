import { jsonArrayFrom } from 'kysely/helpers/postgres';
import { inject, injectable } from 'inversify';
import { database } from '../../../database/database';
import { IMovieModel } from '../models/movieModel';
import { NewMovie } from '../schemas/createMovieSchema';
import { TYPES } from '../../../ioc/types/types';
import { IErrorMapper } from '../../../errors/errorMapper';
import { IMovieWithRatingModel } from '../models/movieWithRatingModel';
import { IMovieFactory } from './movieFactory';

export type MovieRating = {
  userId: string;
  movieId: string;
  rating: number;
};

export interface IMovieRepository {
  findById(id: string): Promise<IMovieModel | undefined>;
  create(newMovie: NewMovie): Promise<IMovieModel>;
  rate(movieId: string, userId: string, rating: number): Promise<MovieRating>;
  findWithRating(id: string): Promise<IMovieWithRatingModel | undefined>;
  updateRate(movieId: string, userId: string, rating: number): Promise<number>;
}

@injectable()
export class MovieRepository implements IMovieRepository {
  constructor(
    @inject(TYPES.ErrorMapperToken)
    private readonly errorMapper: IErrorMapper,
    @inject(TYPES.MovieFactoryToken)
    private readonly movieFactory: IMovieFactory,
    private readonly db = database
  ) {}

  async findById(id: string): Promise<IMovieModel | undefined> {
    const movie = await this.db
      .selectFrom('movie')
      .where('id', '=', id)
      .selectAll()
      .executeTakeFirst();

    return movie ? this.movieFactory.createMovie(movie) : undefined;
  }

  async create(newMovie: NewMovie): Promise<IMovieModel> {
    try {
      const movie = await this.db
        .insertInto('movie')
        .values(newMovie)
        .returningAll()
        .executeTakeFirstOrThrow();

      return this.movieFactory.createMovie(movie);
    } catch (err) {
      throw this.errorMapper.mapRepositoryError(err);
    }
  }

  async rate(
    movieId: string,
    userId: string,
    rating: number
  ): Promise<MovieRating> {
    try {
      return await this.db
        .insertInto('user_movie_ratings')
        .values({ userId, rating, movieId })
        .returningAll()
        .executeTakeFirstOrThrow();
    } catch (err) {
      throw this.errorMapper.mapRepositoryError(err);
    }
  }

  async updateRate(
    movieId: string,
    userId: string,
    rating: number
  ): Promise<number> {
    const updatedRows = await this.db
      .updateTable('user_movie_ratings')
      .set({ rating })
      .where('movieId', '=', movieId)
      .where('userId', '=', userId)
      .execute();

    return Number(updatedRows[0].numUpdatedRows.toString());
  }

  async findWithRating(id: string): Promise<IMovieWithRatingModel | undefined> {
    const movie = await this.db
      .selectFrom('movie')
      .selectAll()
      .where('movie.id', '=', id)
      .select((eb) => [
        jsonArrayFrom(
          eb
            .selectFrom('user_movie_ratings')
            .select(['user_movie_ratings.userId', 'user_movie_ratings.rating'])
            .whereRef('user_movie_ratings.movieId', '=', 'movie.id')
        ).as('rating'),
      ])
      .executeTakeFirst();

    return movie ? this.movieFactory.createMovieWithRating(movie) : undefined;
  }
}
