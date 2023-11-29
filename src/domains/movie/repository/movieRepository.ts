import { inject, injectable } from 'inversify';
import { database } from '../../../database/database';
import { Movie } from '../models/movie';
import { NewMovieWithoutActors } from '../schemas/createMovieValidationSchema';
import { TYPES } from '../../../ioc/types/types';
import { IErrorMapper } from '../../../errors/errorMapper';
import { CategoryType } from '../types/categoryType';
import { MovieCriteria } from '../schemas/findMovieByCriteriaValidationSchema';

export type MovieFromDB = {
  id: string;
  title: string;
  category: CategoryType;
  releaseDate: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
};

export interface IMovieRepository {
  create(newMovie: NewMovieWithoutActors): Promise<MovieFromDB>;
  findById(id: string): Promise<MovieFromDB | null>;
  findByCriteria(criteria: MovieCriteria): Promise<MovieFromDB[]>;
}

@injectable()
export class MovieRepository implements IMovieRepository {
  private readonly movieTable = 'movies';

  constructor(
    @inject(TYPES.ErrorMapperToken)
    private readonly errorMapper: IErrorMapper,
    private readonly db = database
  ) {}

  async findById(id: string): Promise<MovieFromDB | null> {
    const movie = await this.db
      .selectFrom(this.movieTable)
      .where('id', '=', id)
      .selectAll()
      .executeTakeFirst();

    return movie ?? null;
  }

  async findByCriteria(criteria: MovieCriteria): Promise<MovieFromDB[]> {
    const { category, releaseDate, title } = criteria;

    let query = this.db.selectFrom(this.movieTable);

    if (title) query = query.where('title', 'ilike', `%${title}%`);
    if (category) query = query.where('category', '=', category);
    if (releaseDate) query = query.where('releaseDate', '=', releaseDate);

    const movies = await query.selectAll().distinctOn('id').execute();

    return movies;
  }

  async create(newMovie: NewMovieWithoutActors): Promise<MovieFromDB> {
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
}
