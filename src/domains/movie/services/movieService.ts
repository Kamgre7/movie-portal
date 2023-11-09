import { inject, injectable } from 'inversify';
import { IMovieModel } from '../models/movieModel';
import { NewMovie } from '../schemas/createMovieSchema';
import { TYPES } from '../../../ioc/types/types';
import { IMovieRepository, MovieRating } from '../repository/movieRepository';
import { NotFoundError } from '../../../errors/notFoundError';
import { IMovieWithRatingModel } from '../models/movieWithRatingModel';
import { BadRequestError } from '../../../errors/badRequestError';

export interface IMovieService {
  create(newMovie: NewMovie): Promise<IMovieModel>;
  findById(id: string): Promise<IMovieModel>;
  rate(movieId: string, userId: string, rating: number): Promise<MovieRating>;
  updateRate(movieId: string, userId: string, rating: number): Promise<void>;
  findWithRating(id: string): Promise<IMovieWithRatingModel>;
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

  async rate(
    movieId: string,
    userId: string,
    rating: number
  ): Promise<MovieRating> {
    return this.movieRepository.rate(movieId, userId, rating);
  }

  async updateRate(
    movieId: string,
    userId: string,
    rating: number
  ): Promise<void> {
    const updatedRows = await this.movieRepository.updateRate(
      movieId,
      userId,
      rating
    );

    if (updatedRows === 0) {
      throw new BadRequestError('No rate updated');
    }
  }

  async findWithRating(id: string): Promise<IMovieWithRatingModel> {
    const movie = await this.movieRepository.findWithRating(id);

    if (movie === undefined) {
      throw new NotFoundError('Movie not found');
    }

    return movie;
  }
}
