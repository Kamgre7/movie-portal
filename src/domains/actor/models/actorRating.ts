import { ActorInMovieRating } from '../repository/actorRatingRepository';

export interface IActorRatingModel {
  userId: string;
  movieId: string;
  rating: number;
}

export class ActorRating implements IActorRatingModel {
  userId: string;
  movieId: string;
  rating: number;

  private constructor(ratingInfo: ActorInMovieRating) {
    this.rating = ratingInfo.rating;
    this.userId = ratingInfo.userId;
    this.movieId = ratingInfo.movieId;
  }

  static createFromDB(actorInfo: ActorInMovieRating): IActorRatingModel {
    return new ActorRating(actorInfo);
  }
}
