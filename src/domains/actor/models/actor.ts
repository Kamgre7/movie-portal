import { GenderType } from '../../user/types/genderType';
import { ActorFromDB } from '../repository/actorRepository';
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

export class Actor implements IActorModel {
  id: string;
  firstName: string;
  lastName: string;
  gender: GenderType;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  rating?: IActorRatingModel[];

  private constructor(actorInfo: ActorFromDB, rating?: IActorRatingModel[]) {
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

  static createFromDB(actorInfo: ActorFromDB): IActorModel {
    return new Actor(actorInfo);
  }
}
