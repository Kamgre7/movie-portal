import { SexType } from '../types/sexType';

export interface IUserModel {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  gender: SexType;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export class User implements IUserModel {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  gender: SexType;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;

  constructor(userInfo: IUserModel) {
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
}
