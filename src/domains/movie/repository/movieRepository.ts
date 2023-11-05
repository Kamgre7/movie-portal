import { injectable } from 'inversify';
import { database } from '../../../database/database';
import { BadRequestError } from '../../../errors/badRequestError';
import { DbError, DbErrorCodes } from '../../../errors/dbError';
import { IMovieModel, Movie } from '../models/movieModel';
import { NewMovie } from '../schemas/createMovieSchema';

export interface IMovieRepository {
  findById(id: string): Promise<IMovieModel | undefined>;
  create(newMovie: NewMovie): Promise<IMovieModel>;
}

@injectable()
export class MovieRepository implements IMovieRepository {
  constructor(private readonly db = database) {}

  async findById(id: string): Promise<IMovieModel | undefined> {
    const movie = await this.db
      .selectFrom('movie')
      .where('id', '=', id)
      .selectAll()
      .executeTakeFirst();

    return movie
      ? [movie].map((movieModel) => new Movie(movieModel))[0]
      : undefined;
  }

  async create(newMovie: NewMovie): Promise<IMovieModel> {
    try {
      const movie = await this.db
        .insertInto('movie')
        .values(newMovie)
        .returningAll()
        .executeTakeFirstOrThrow();

      return [movie].map((movieModel) => new Movie(movieModel))[0];
    } catch (err) {
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
