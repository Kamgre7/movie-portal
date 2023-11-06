import { SexType } from '../../user/types/sexType';

export interface IActorModel {
  id: string;
  firstName: string;
  lastName: string;
  gender: SexType;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export class Actor implements IActorModel {
  id: string;
  firstName: string;
  lastName: string;
  gender: SexType;
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
