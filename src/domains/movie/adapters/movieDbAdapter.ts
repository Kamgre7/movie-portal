import { inject, injectable } from 'inversify';
import { IMovieModel, Movie } from '../models/movie';
import { NewMovieWithoutActors } from '../schemas/createMovieValidationSchema';
import { TYPES } from '../../../ioc/types/types';
import { IMovieRepository } from '../repository/movieRepository';
import { MovieCriteria } from '../schemas/findMovieByCriteriaValidationSchema';

export interface IMovieDbAdapter {
  create(newMovie: NewMovieWithoutActors): Promise<IMovieModel>;
  findByCriteria(criteria: MovieCriteria): Promise<IMovieModel[]>;
  findById(id: string): Promise<IMovieModel | null>;
}

@injectable()
export class MovieDbAdapter implements IMovieDbAdapter {
  constructor(
    @inject(TYPES.MovieRepositoryToken)
    private readonly movieRepository: IMovieRepository
  ) {}

  async create(newMovie: NewMovieWithoutActors): Promise<IMovieModel> {
    const movie = await this.movieRepository.create(newMovie);

    return Movie.createFromDB(movie);
  }

  async findById(id: string): Promise<IMovieModel | null> {
    const movie = await this.movieRepository.findById(id);

    return movie ? Movie.createFromDB(movie) : null;
  }

  async findByCriteria(criteria: MovieCriteria): Promise<IMovieModel[]> {
    const movies = await this.movieRepository.findByCriteria(criteria);

    return movies.map((movie) => Movie.createFromDB(movie));
  }
}
