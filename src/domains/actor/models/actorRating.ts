import { ActorInMovieRating } from '../repository/actorRatingRepository';

export type ActorRatingConstructor = Omit<ActorInMovieRating, 'actorId'>;

export interface IActorRatingModel {
  userId: string;
  movieId: string;
  rating: number;
}

export class ActorRating implements IActorRatingModel {
  userId: string;
  movieId: string;
  rating: number;

  private constructor(ratingInfo: ActorRatingConstructor) {
    this.rating = ratingInfo.rating;
    this.userId = ratingInfo.userId;
    this.movieId = ratingInfo.movieId;
  }

  static createFromDB(ratingInfo: ActorRatingConstructor): IActorRatingModel {
    return new ActorRating(ratingInfo);
  }
}
