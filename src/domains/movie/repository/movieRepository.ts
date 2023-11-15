import { jsonArrayFrom } from 'kysely/helpers/postgres';
import { inject, injectable } from 'inversify';
import { database } from '../../../database/database';
import { IMovieModel } from '../models/movieModel';
import { NewMovieWithoutActors } from '../schemas/createMovieValidationSchema';
import { TYPES } from '../../../ioc/types/types';
import { IErrorMapper } from '../../../errors/errorMapper';
import { IMovieWithRatingModel } from '../models/movieWithRatingModel';
import { IMovieWithActorsModel } from '../models/movieWithActorsModel';
import { MovieCriteriaWithoutActors } from '../schemas/findMovieByCriteriaValdiationSchema';
import { MovieFactory } from './movieFactory';

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
    actors: string[]
  ): Promise<IMovieModel[] | undefined>;
  create(newMovie: NewMovieWithoutActors): Promise<IMovieModel>;
  rate(
    movieId: string,
    userId: string,
    rating: number
  ): Promise<MovieRating | void>;
  findWithRating(id: string): Promise<IMovieWithRatingModel | undefined>;
  updateRate(movieId: string, userId: string, rating: number): Promise<number>;
  addActors(actorsMovieInfo: MovieActors[]): Promise<MovieActors[]>;
  findWithActors(id: string): Promise<IMovieWithActorsModel | undefined>;
}

@injectable()
export class MovieRepository implements IMovieRepository {
  constructor(
    @inject(TYPES.ErrorMapperToken)
    private readonly errorMapper: IErrorMapper,
    private readonly db = database
  ) {}

  async findById(id: string): Promise<IMovieModel | undefined> {
    const movie = await this.db
      .selectFrom('movies')
      .where('id', '=', id)
      .selectAll()
      .executeTakeFirst();

    return movie ? MovieFactory.createMovie(movie) : undefined;
  }

  async findByCriteria(
    criteria: MovieCriteriaWithoutActors,
    actors: string[]
  ): Promise<IMovieModel[] | undefined> {
    const { category, releaseDate, title } = criteria;

    let query = this.db.selectFrom('movies');

    if (title) query = query.where('title', 'ilike', `%${title}%`);
    if (category) query = query.where('category', '=', category);
    if (releaseDate) query = query.where('releaseDate', '=', releaseDate);

    if (actors.length) {
      query = query
        .innerJoin('actors_movies', 'actors_movies.movieId', 'movies.id')
        .where('actors_movies.actorId', 'in', actors);
    }

    const movies = await query.selectAll().distinctOn('id').execute();

    return movies.length
      ? movies.map((movie) => MovieFactory.createMovie(movie))
      : undefined;
  }

  async create(newMovie: NewMovieWithoutActors): Promise<IMovieModel> {
    try {
      const movie = await this.db
        .insertInto('movies')
        .values(newMovie)
        .returningAll()
        .executeTakeFirstOrThrow();

      return MovieFactory.createMovie(movie);
    } catch (err) {
      throw this.errorMapper.mapRepositoryError(err);
    }
  }

  async rate(
    movieId: string,
    userId: string,
    rating: number
  ): Promise<MovieRating | void> {
    try {
      const rate = await this.db
        .insertInto('users_movies_ratings')
        .values({ userId, rating, movieId })
        .returningAll()
        .executeTakeFirstOrThrow();

      return rate;
    } catch (err: any) {
      throw this.errorMapper.mapRepositoryError(err);
    }
  }

  async updateRate(
    movieId: string,
    userId: string,
    rating: number
  ): Promise<number> {
    const [{ numUpdatedRows }] = await this.db
      .updateTable('users_movies_ratings')
      .set({ rating })
      .where('movieId', '=', movieId)
      .where('userId', '=', userId)
      .execute();

    return Number(numUpdatedRows.toString());
  }

  async findWithRating(id: string): Promise<IMovieWithRatingModel | undefined> {
    const movie = await this.db
      .selectFrom('movies')
      .selectAll()
      .where('movies.id', '=', id)
      .select((eb) => [
        jsonArrayFrom(
          eb
            .selectFrom('users_movies_ratings')
            .select([
              'users_movies_ratings.userId',
              'users_movies_ratings.rating',
            ])
            .whereRef('users_movies_ratings.movieId', '=', 'movies.id')
        ).as('rating'),
      ])
      .executeTakeFirst();

    return movie ? MovieFactory.createMovieWithRating(movie) : undefined;
  }

  async findWithActors(id: string): Promise<IMovieWithActorsModel | undefined> {
    const movie = await this.db
      .selectFrom('movies')
      .selectAll()
      .where('movies.id', '=', id)
      .select((eb) => [
        jsonArrayFrom(
          eb
            .selectFrom('actors_movies')
            .select(['actors_movies.actorId'])
            .whereRef('actors_movies.movieId', '=', 'movies.id')
        ).as('actors'),
      ])
      .executeTakeFirst();

    return movie ? MovieFactory.createMovieWithActors(movie) : undefined;
  }

  async addActors(actorsMovieInfo: MovieActors[]): Promise<MovieActors[]> {
    try {
      return await this.db
        .insertInto('actors_movies')
        .values(actorsMovieInfo)
        .returningAll()
        .execute();
    } catch (err) {
      throw this.errorMapper.mapRepositoryError(err);
    }
  }
}
