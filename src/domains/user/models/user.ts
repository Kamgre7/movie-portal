import { GenderType } from '../types/genderType';

export interface IUserModel {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  gender: GenderType;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  watchList?: { movieId: string }[];
}

export type UserConstructor = Omit<IUserModel, 'watchList'>;

export class User implements IUserModel {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  gender: GenderType;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  watchList?: { movieId: string }[];

  private constructor(userInfo: UserConstructor, watchList?: []) {
    this.id = userInfo.id;
    this.email = userInfo.email;
    this.firstName = userInfo.firstName;
    this.lastName = userInfo.lastName;
    this.password = userInfo.password;
    this.gender = userInfo.gender;
    this.createdAt = userInfo.createdAt;
    this.updatedAt = userInfo.updatedAt;
    this.deletedAt = userInfo.deletedAt;
  }

  static createFromDB(userInfo: UserConstructor): IUserModel {
    return new User(userInfo);
  }
}
