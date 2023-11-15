import { inject, injectable } from 'inversify';
import { IMovieModel } from '../models/movieModel';
import { NewMovie } from '../schemas/createMovieValidationSchema';
import { TYPES } from '../../../ioc/types/types';
import {
  IMovieRepository,
  MovieActors,
  MovieRating,
} from '../repository/movieRepository';
import { NotFoundError } from '../../../errors/notFoundError';
import { IMovieWithRatingModel } from '../models/movieWithRatingModel';
import { BadRequestError } from '../../../errors/badRequestError';
import { IMovieWithActorsModel } from '../models/movieWithActorsModel';
import { MovieCriteria } from '../schemas/findMovieByCriteriaValdiationSchema';

export interface IMovieService {
  create(newMovie: NewMovie): Promise<IMovieModel>;
  findById(id: string): Promise<IMovieModel>;
  findByCriteria(criteria: MovieCriteria): Promise<IMovieModel[]>;
  rate(movieId: string, userId: string, rating: number): Promise<MovieRating>;
  updateRate(movieId: string, userId: string, rating: number): Promise<void>;
  findWithRating(id: string): Promise<IMovieWithRatingModel>;
  addActors(movieId: string, actorIds: string[]): Promise<MovieActors[]>;
  findWithActors(id: string): Promise<IMovieWithActorsModel>;
}

@injectable()
export class MovieService implements IMovieService {
  constructor(
    @inject(TYPES.MovieRepositoryToken)
    private readonly movieRepository: IMovieRepository
  ) {}

  async create(newMovie: NewMovie): Promise<IMovieModel> {
    const { actors, ...movieInfo } = newMovie;

    const movie = await this.movieRepository.create(movieInfo);

    if (actors) {
      await this.addActors(movie.id, actors);
    }

    return movie;
  }

  async findById(id: string): Promise<IMovieModel> {
    const movie = await this.movieRepository.findById(id);

    if (!movie) {
      throw new NotFoundError('Movie not found');
    }

    return movie;
  }

  async findByCriteria(criteria: MovieCriteria): Promise<IMovieModel[]> {
    const { actors, ...movieCriteria } = criteria;

    const movies = await this.movieRepository.findByCriteria(
      movieCriteria,
      actors
    );

    if (!movies) {
      throw new NotFoundError('Movies not found');
    }

    return movies;
  }

  async rate(
    movieId: string,
    userId: string,
    rating: number
  ): Promise<MovieRating> {
    await this.findById(movieId);

    const rateInfo = await this.movieRepository.rate(movieId, userId, rating);

    return rateInfo!;
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

    if (!updatedRows) {
      throw new BadRequestError('No rate updated');
    }
  }

  async findWithRating(id: string): Promise<IMovieWithRatingModel> {
    const movie = await this.movieRepository.findWithRating(id);

    if (!movie) {
      throw new NotFoundError('Movie not found');
    }

    return movie;
  }

  async findWithActors(id: string): Promise<IMovieWithActorsModel> {
    const movie = await this.movieRepository.findWithActors(id);

    if (!movie) {
      throw new NotFoundError('Movie not found');
    }

    return movie;
  }

  async addActors(movieId: string, actorIds: string[]): Promise<MovieActors[]> {
    const actorMovieIds = this.mapActorsMovie(movieId, actorIds);

    return await this.movieRepository.addActors(actorMovieIds);
  }

  private mapActorsMovie(movieId: string, actorIds: string[]): MovieActors[] {
    return actorIds.map((actorId) => ({
      movieId,
      actorId,
    }));
  }
}
