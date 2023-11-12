import { jsonArrayFrom } from 'kysely/helpers/postgres';
import { inject, injectable } from 'inversify';
import { database } from '../../../database/database';
import { IMovieModel } from '../models/movieModel';
import { NewMovieWithoutActors } from '../schemas/createMovieSchema';
import { TYPES } from '../../../ioc/types/types';
import { IErrorMapper } from '../../../errors/errorMapper';
import { IMovieWithRatingModel } from '../models/movieWithRatingModel';
import { IMovieFactory } from './movieFactory';
import { IMovieWithActorsModel } from '../models/movieWithActorsModel';
import {
  MovieCriteria,
  MovieCriteriaWithoutActors,
} from '../schemas/findMovieByCriteriaSchema';

export type MovieRating = {
  userId: string;
  movieId: string;
  rating: number;
};

export type MovieActors = {
  movieId: string;
  actorId: string;
};

export interface IMovieRepository {
  findById(id: string): Promise<IMovieModel | undefined>;
  findByCriteria(
    criteria: MovieCriteriaWithoutActors,
    actors: string[] | undefined
  ): Promise<IMovieModel[] | undefined>;
  create(newMovie: NewMovieWithoutActors): Promise<IMovieModel>;
  rate(movieId: string, userId: string, rating: number): Promise<MovieRating>;
  findWithRating(id: string): Promise<IMovieWithRatingModel | undefined>;
  updateRate(movieId: string, userId: string, rating: number): Promise<number>;
  addActors(actorsMovieInfo: MovieActors[]): Promise<number>;
  findWithActors(id: string): Promise<IMovieWithActorsModel | undefined>;
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

  async findByCriteria(
    criteria: MovieCriteriaWithoutActors,
    actors?: string[]
  ): Promise<IMovieModel[] | undefined> {
    const movies = await this.db
      .selectFrom('movie')
      .selectAll()
      .$if(criteria.title ? true : false, (qb) =>
        qb.where('title', 'ilike', `%${criteria.title!}%`)
      )
      .$if(criteria.category ? true : false, (qb) =>
        qb.where('category', '=', criteria.category!)
      )
      .$if(criteria.releaseDate ? true : false, (qb) =>
        qb.where('releaseDate', '=', criteria.releaseDate!)
      )
      .$if(actors ? true : false, (qb) =>
        qb
          .innerJoin('actor_movie', 'actor_movie.movieId', 'movie.id')
          .where('actor_movie.actorId', 'in', actors as string[])
      )
      .distinctOn('id')
      .execute();

    return movies.length > 0
      ? this.movieFactory.createManyMovie(movies)
      : undefined;
  }

  async create(newMovie: NewMovieWithoutActors): Promise<IMovieModel> {
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

  async findWithActors(id: string): Promise<IMovieWithActorsModel | undefined> {
    const movie = await this.db
      .selectFrom('movie')
      .selectAll()
      .where('movie.id', '=', id)
      .select((eb) => [
        jsonArrayFrom(
          eb
            .selectFrom('actor_movie')
            .select(['actor_movie.actorId'])
            .whereRef('actor_movie.movieId', '=', 'movie.id')
        ).as('actors'),
      ])
      .executeTakeFirst();

    return movie ? this.movieFactory.createMovieWithActors(movie) : undefined;
  }

  async addActors(actorsMovieInfo: MovieActors[]): Promise<number> {
    try {
      const insertedRows = await this.db
        .insertInto('actor_movie')
        .values(actorsMovieInfo)
        .execute();

      return Number(insertedRows[0].numInsertedOrUpdatedRows!.toString());
    } catch (err) {
      throw this.errorMapper.mapRepositoryError(err);
    }
  }
}
