import { inject, injectable } from 'inversify';
import { IMovieModel } from '../models/movieModel';
import { NewMovie } from '../schemas/createMovieSchema';
import { TYPES } from '../../../ioc/types/types';
import { IMovieRepository } from '../repository/movieRepository';
import { NotFoundError } from '../../../errors/notFoundError';

export interface IMovieService {
  create(newMovie: NewMovie): Promise<IMovieModel>;
  findById(id: string): Promise<IMovieModel>;
}

@injectable()
export class MovieService implements IMovieService {
  constructor(
    @inject(TYPES.MovieRepositoryToken)
    private readonly movieRepository: IMovieRepository
  ) {}

  async create(newMovie: NewMovie): Promise<IMovieModel> {
    return this.movieRepository.create(newMovie);
  }

  async findById(id: string): Promise<IMovieModel> {
    const movie = await this.movieRepository.findById(id);

    if (movie === undefined) {
      throw new NotFoundError('Movie not found');
    }

    return movie;
  }
}
