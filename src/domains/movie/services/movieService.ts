import { inject, injectable } from 'inversify';
import { IMovieModel } from '../models/movie';
import { NewMovie } from '../schemas/createMovieValidationSchema';
import { TYPES } from '../../../ioc/types/types';
import { NotFoundError } from '../../../errors/notFoundError';
import { MovieExtensionCriteria, MovieCriteria } from '../schemas/findMovieByCriteriaValidationSchema';
import { IActorsMoviesRepository } from '../../actor/repository/actorMovieRepository';
import { IMovieRatingRepository, MovieRatingData } from '../repository/movieRatingRepository';
import { IMovieRatingModel } from '../models/movieRating';
import { IMovieRepository } from '../repository/movieRepository';

export interface IMovieService {
  create(newMovie: NewMovie): Promise<IMovieModel>;
  findById(id: string, extension: MovieExtensionCriteria): Promise<IMovieModel>;
  findByCriteria(criteria: MovieCriteria, extension: MovieExtensionCriteria): Promise<IMovieModel[]>;

  rate(movieRating: MovieRatingData): Promise<IMovieRatingModel>;
  updateRate(movieRating: MovieRatingData): Promise<IMovieRatingModel>;

  addActorsToMovie(movieId: string, actorIds: string[]): Promise<void>;
}

@injectable()
export class MovieService implements IMovieService {
  constructor(
    @inject(TYPES.MovieRepositoryToken)
    private readonly movieRepository: IMovieRepository,
    @inject(TYPES.MovieRatingRepositoryToken)
    private readonly movieRatingRepository: IMovieRatingRepository,
    @inject(TYPES.ActorMoviesRepositoryToken)
    private readonly actorMovieRepository: IActorsMoviesRepository,
  ) {}

  async create(newMovie: NewMovie): Promise<IMovieModel> {
    const { actors, ...movieInfo } = newMovie;

    const movie = await this.movieRepository.create(movieInfo);

    if (actors?.length) {
      await this.addActorsToMovie(movie.id, actors);
    }

    return movie;
  }

  async findById(id: string, extension: MovieExtensionCriteria): Promise<IMovieModel> {
    const movie = await this.movieRepository.findById(id, extension);

    if (!movie) {
      throw new NotFoundError('Movie not found');
    }

    return movie;
  }

  async findByCriteria(criteria: MovieCriteria, extension: MovieExtensionCriteria): Promise<IMovieModel[]> {
    const movies = await this.movieRepository.findByCriteria(criteria, extension);

    return movies;
  }

  async rate(movieRating: MovieRatingData): Promise<IMovieRatingModel> {
    return this.movieRatingRepository.rate(movieRating);
  }

  async updateRate(movieRating: MovieRatingData): Promise<IMovieRatingModel> {
    return this.movieRatingRepository.update(movieRating);
  }

  async addActorsToMovie(movieId: string, actorIds: string[]): Promise<void> {
    await Promise.all(actorIds.map((actor) => this.actorMovieRepository.addActor(actor, movieId)));
  }
}
