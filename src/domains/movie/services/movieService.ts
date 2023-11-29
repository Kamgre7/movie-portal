import { inject, injectable } from 'inversify';
import { IMovieModel } from '../models/movie';
import { NewMovie } from '../schemas/createMovieValidationSchema';
import { TYPES } from '../../../ioc/types/types';
import { NotFoundError } from '../../../errors/notFoundError';
import { MovieCriteria } from '../schemas/findMovieByCriteriaValidationSchema';
import { IMovieDbAdapter } from '../adapters/movieDbAdapter';
import { IMovieRatingDbAdapter } from '../adapters/movieRatingDbAdapter';

export interface IMovieService {
  create(newMovie: NewMovie): Promise<IMovieModel>;
  findById(id: string): Promise<IMovieModel>;
  findByCriteria(criteria: MovieCriteria): Promise<IMovieModel[]>;
}

@injectable()
export class MovieService implements IMovieService {
  constructor(
    @inject(TYPES.MovieDbAdapterToken)
    private readonly movieDbAdapter: IMovieDbAdapter,
    @inject(TYPES.MovieRatingDbAdapterToken)
    private readonly movieRatingDbAdapter: IMovieRatingDbAdapter
  ) {}

  async create(newMovie: NewMovie): Promise<IMovieModel> {
    const { actors, ...movieInfo } = newMovie;

    const movie = await this.movieDbAdapter.create(movieInfo);

    return movie;
  }

  async findById(id: string): Promise<IMovieModel> {
    const movie = await this.movieDbAdapter.findById(id);

    if (!movie) {
      throw new NotFoundError('Movie not found');
    }

    return movie;
  }

  async findByCriteria(criteria: MovieCriteria): Promise<IMovieModel[]> {
    const { actors, ...movieCriteria } = criteria;

    const movies = await this.movieDbAdapter.findByCriteria(criteria);

    return movies;
  }
}
