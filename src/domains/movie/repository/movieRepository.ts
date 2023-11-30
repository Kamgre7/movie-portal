import { inject, injectable } from 'inversify';
import { database } from '../../../database/database';
import { IMovieModel, Movie } from '../models/movie';
import { NewMovieWithoutActors } from '../schemas/createMovieValidationSchema';
import { TYPES } from '../../../ioc/types/types';
import { IErrorMapper } from '../../../errors/errorMapper';
import {
  MovieCriteria,
  MovieExtensionCriteria,
} from '../schemas/findMovieByCriteriaValidationSchema';
import { IMovieRatingRepository } from './movieRatingRepository';
import { IActorsMoviesRepository } from '../../actor/repository/actorMovieRepository';

export interface IMovieRepository {
  create(newMovie: NewMovieWithoutActors): Promise<IMovieModel>;
  findById(id: string, extension: MovieExtensionCriteria): Promise<IMovieModel | null>;
  findByCriteria(
    criteria: MovieCriteria,
    extension: MovieExtensionCriteria
  ): Promise<IMovieModel[]>;
}

@injectable()
export class MovieRepository implements IMovieRepository {
  private readonly movieTable = 'movies';

  constructor(
    @inject(TYPES.ErrorMapperToken)
    private readonly errorMapper: IErrorMapper,
    @inject(TYPES.MovieRatingRepositoryToken)
    private readonly movieRatingRepository: IMovieRatingRepository,
    @inject(TYPES.ActorMoviesRepositoryToken)
    private readonly actorMoviesRepository: IActorsMoviesRepository,
    private readonly db = database
  ) {}

  async create(newMovie: NewMovieWithoutActors): Promise<IMovieModel> {
    try {
      const movie = await this.db
        .insertInto(this.movieTable)
        .values(newMovie)
        .returningAll()
        .executeTakeFirstOrThrow();

      return Movie.createFromDB(movie);
    } catch (err) {
      throw this.errorMapper.mapRepositoryError(err);
    }
  }

  async findById(id: string, extension: MovieExtensionCriteria): Promise<IMovieModel | null> {
    const movie = await this.db
      .selectFrom(this.movieTable)
      .where('id', '=', id)
      .selectAll()
      .executeTakeFirst();

    if (!movie) {
      return null;
    }

    const rating = extension.withRating
      ? await this.movieRatingRepository.find(movie.id)
      : undefined;

    const actors = extension.withActors
      ? await this.actorMoviesRepository.findAll(movie.id)
      : undefined;

    if (rating || actors) {
      return Movie.createExtended(movie, { rating, actors });
    }

    return Movie.createFromDB(movie);
  }

  async findByCriteria(
    criteria: MovieCriteria,
    extension: MovieExtensionCriteria
  ): Promise<IMovieModel[]> {
    const { category, releaseDate, title } = criteria;

    let query = this.db.selectFrom(this.movieTable);

    if (title) query = query.where('title', 'ilike', `%${title}%`);
    if (category) query = query.where('category', '=', category);
    if (releaseDate) query = query.where('releaseDate', '=', releaseDate);

    const movies = await query.selectAll().distinctOn('id').execute();

    const ratings = extension.withRating
      ? await Promise.all(movies.map((movie) => this.movieRatingRepository.find(movie.id)))
      : undefined;

    const actors = extension.withActors
      ? await Promise.all(movies.map((movie) => this.actorMoviesRepository.findAll(movie.id)))
      : undefined;

    if (ratings || actors) {
      return movies.map((movie, index) =>
        Movie.createExtended(movie, { rating: ratings?.[index], actors: actors?.[index] })
      );
    }

    return movies.map((movie) => Movie.createFromDB(movie));
  }
}
