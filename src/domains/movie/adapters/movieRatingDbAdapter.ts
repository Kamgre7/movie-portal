import { inject, injectable } from 'inversify';
import { TYPES } from '../../../ioc/types/types';
import { IMovieRatingRepository, MovieRatingData } from '../repository/movieRatingRepository';
import { IMovieRatingModel, MovieRating } from '../models/movieRating';

export interface IMovieRatingDbAdapter {
  rate(movieRateInfo: MovieRatingData): Promise<IMovieRatingModel>;
  update(movieRateInfo: MovieRatingData): Promise<IMovieRatingModel>;
  find(movieId: string): Promise<IMovieRatingModel[]>;
}

@injectable()
export class MovieRatingDbAdapter implements IMovieRatingDbAdapter {
  constructor(
    @inject(TYPES.MovieRatingRepositoryToken)
    private readonly movieRatingRepository: IMovieRatingRepository
  ) {}

  async rate(movieRateInfo: MovieRatingData): Promise<IMovieRatingModel> {
    const rating = await this.movieRatingRepository.rate(movieRateInfo);

    return MovieRating.createFromDB(rating);
  }

  async update(movieRateInfo: MovieRatingData): Promise<IMovieRatingModel> {
    const rating = await this.movieRatingRepository.update(movieRateInfo);

    return MovieRating.createFromDB(rating);
  }

  async find(movieId: string): Promise<IMovieRatingModel[]> {
    const ratings = await this.movieRatingRepository.find(movieId);

    return ratings.map((rating) => MovieRating.createFromDB(rating));
  }
}
