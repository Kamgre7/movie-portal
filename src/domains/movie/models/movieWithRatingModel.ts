import { IMovieModel, Movie } from './movieModel';

export interface IMovieWithRatingModel extends IMovieModel {
  rating: {
    userId: string;
    rating: number;
  }[];
}

export class MovieWithRating extends Movie implements IMovieWithRatingModel {
  rating: {
    userId: string;
    rating: number;
  }[];

  constructor(movieInfo: IMovieWithRatingModel) {
    super(movieInfo);
    this.rating = movieInfo.rating;
  }
}
