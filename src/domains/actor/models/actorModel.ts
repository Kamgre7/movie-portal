import { GenderType } from '../../user/types/genderType';

export interface IActorModel {
  id: string;
  firstName: string;
  lastName: string;
  gender: GenderType;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export class Actor implements IActorModel {
  id: string;
  firstName: string;
  lastName: string;
  gender: GenderType;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;

  constructor(actorInfo: IActorModel) {
    this.id = actorInfo.id;
    this.firstName = actorInfo.firstName;
    this.lastName = actorInfo.lastName;
    this.gender = actorInfo.gender;
    this.createdAt = actorInfo.createdAt;
    this.updatedAt = actorInfo.updatedAt;
    this.deletedAt = actorInfo.deletedAt;
  }
}
