import { injectable } from 'inversify';
import { IMovieModel, Movie } from '../models/movieModel';
import {
  IMovieWithRatingModel,
  MovieWithRating,
} from '../models/movieWithRatingModel';

export interface IMovieFactory {
  createMovie(movieInfo: IMovieModel): Movie;
  createMovieWithRating(movieInfo: IMovieWithRatingModel): MovieWithRating;
}

@injectable()
export class MovieFactory implements IMovieFactory {
  constructor() {}

  createMovie(movieInfo: IMovieModel): Movie {
    return new Movie(movieInfo);
  }

  createMovieWithRating(movieInfo: IMovieWithRatingModel): MovieWithRating {
    return new MovieWithRating(movieInfo);
  }
}
