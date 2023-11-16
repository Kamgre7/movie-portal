import { IMovieModel, Movie } from '../models/movieModel';
import { IMovieWithRatingModel, MovieWithRating } from '../models/movieWithRatingModel';
import { IMovieWithActorsModel, MovieWithActors } from '../models/movieWithActorsModel';

export class MovieFactory {
  private constructor() {}

  static createMovie(movieInfo: IMovieModel): Movie {
    return new Movie(movieInfo);
  }

  static createMovieWithRating(movieInfo: IMovieWithRatingModel): MovieWithRating {
    return new MovieWithRating(movieInfo);
  }

  static createMovieWithActors(movieInfo: IMovieWithActorsModel): MovieWithActors {
    return new MovieWithActors(movieInfo);
  }
}
