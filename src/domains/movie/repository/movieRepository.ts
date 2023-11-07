import { inject, injectable } from 'inversify';
import { database } from '../../../database/database';
import { IMovieModel, Movie } from '../models/movieModel';
import { NewMovie } from '../schemas/createMovieSchema';
import { TYPES } from '../../../ioc/types/types';
import { IErrorMapper } from '../../../errors/errorMapper';

export interface IMovieRepository {
  findById(id: string): Promise<IMovieModel | undefined>;
  create(newMovie: NewMovie): Promise<IMovieModel>;
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
      throw this.errorMapper.mapRepositoryError(err);
    }
  }
}
