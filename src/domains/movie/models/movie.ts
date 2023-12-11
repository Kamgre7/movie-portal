import { CategoryType } from '../types/categoryType';
import { IMovieRatingModel } from './movieRating';

export type MovieExtension = {
  actors?: ActorInMovieData[];
  rating?: IMovieRatingModel[];
};

export type ActorInMovieData = { actorId: string };
export type MovieConstructor = Omit<IMovieModel, 'actors' | 'rating'>;

export interface IMovieModel {
  id: string;
  title: string;
  category: CategoryType;
  releaseDate: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  actors: ActorInMovieData[];
  rating: IMovieRatingModel[];
}

export class Movie implements IMovieModel {
  id: string;
  title: string;
  category: CategoryType;
  releaseDate: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  actors: ActorInMovieData[] = [];
  rating: IMovieRatingModel[] = [];

  private constructor(movieInfo: MovieConstructor, extended?: MovieExtension) {
    this.id = movieInfo.id;
    this.title = movieInfo.title;
    this.category = movieInfo.category;
    this.releaseDate = movieInfo.releaseDate;
    this.createdAt = movieInfo.createdAt;
    this.updatedAt = movieInfo.updatedAt;
    this.deletedAt = movieInfo.deletedAt;

    if (extended?.rating) {
      this.rating = extended.rating;
    }

    if (extended?.actors) {
      this.actors = extended.actors;
    }
  }

  static createExtended(movieInfo: MovieConstructor, extended: MovieExtension): IMovieModel {
    return new Movie(movieInfo, extended);
  }

  static createBasic(movieInfo: MovieConstructor): IMovieModel {
    return new Movie(movieInfo);
  }
}
