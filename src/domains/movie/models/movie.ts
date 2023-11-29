import { CategoryType } from '../types/categoryType';

export interface IMovieModel {
  id: string;
  title: string;
  category: CategoryType;
  releaseDate: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  //actors?: ;
  //rating?: ;
}

export class Movie implements IMovieModel {
  id: string;
  title: string;
  category: CategoryType;
  releaseDate: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  // actors?: ActorInfo[];
  //rating?: MovieRatingInfo[];

  private constructor(movieInfo: IMovieModel) {
    this.id = movieInfo.id;
    this.title = movieInfo.title;
    this.category = movieInfo.category;
    this.releaseDate = movieInfo.releaseDate;
    this.createdAt = movieInfo.createdAt;
    this.updatedAt = movieInfo.updatedAt;
    this.deletedAt = movieInfo.deletedAt;
  }

  static createFromDB(movieInfo: IMovieModel): IMovieModel {
    return new Movie(movieInfo);
  }
}
