import { MovieRatingData } from '../repository/movieRatingRepository';

export interface IMovieRatingModel {
  userId: string;
  rating: number;
}

export class MovieRating implements IMovieRatingModel {
  userId: string;
  rating: number;

  private constructor(ratingInfo: MovieRatingData) {
    this.rating = ratingInfo.rating;
    this.userId = ratingInfo.userId;
  }

  static createBasic(movieRating: MovieRatingData): IMovieRatingModel {
    return new MovieRating(movieRating);
  }
}
