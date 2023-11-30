import { GenderType } from '../../user/types/genderType';
import { IActorRatingModel } from './actorRating';

export interface IActorModel {
  id: string;
  firstName: string;
  lastName: string;
  gender: GenderType;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  rating?: IActorRatingModel[];
}

export type ActorConstructor = Omit<IActorModel, 'rating'>;

export class Actor implements IActorModel {
  id: string;
  firstName: string;
  lastName: string;
  gender: GenderType;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  rating?: IActorRatingModel[];

  private constructor(actorInfo: ActorConstructor, rating?: IActorRatingModel[]) {
    this.id = actorInfo.id;
    this.firstName = actorInfo.firstName;
    this.lastName = actorInfo.lastName;
    this.gender = actorInfo.gender;
    this.createdAt = actorInfo.createdAt;
    this.updatedAt = actorInfo.updatedAt;
    this.deletedAt = actorInfo.deletedAt;

    if (rating) {
      this.rating = rating;
    }
  }

  static createWithRating(actorInfo: ActorConstructor, rating: IActorRatingModel[]) {
    return new Actor(actorInfo, rating);
  }

  static createFromDB(actorInfo: ActorConstructor): IActorModel {
    return new Actor(actorInfo);
  }
}
