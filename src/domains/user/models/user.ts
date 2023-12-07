import { UserWatchList } from '../repository/watchilistRepository';
import { GenderType } from '../types/genderType';
import { RoleType } from '../types/userRole';

export interface IUserModel {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  gender: GenderType;
  role: RoleType;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  watchList?: UserWatchList[];
}

export type UserConstructor = Omit<IUserModel, 'watchList'>;

export class User implements IUserModel {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  gender: GenderType;
  role: RoleType;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  watchList?: UserWatchList[];

  private constructor(userInfo: UserConstructor, watchList?: UserWatchList[]) {
    this.id = userInfo.id;
    this.email = userInfo.email;
    this.firstName = userInfo.firstName;
    this.lastName = userInfo.lastName;
    this.password = userInfo.password;
    this.gender = userInfo.gender;
    this.role = userInfo.role;
    this.createdAt = userInfo.createdAt;
    this.updatedAt = userInfo.updatedAt;
    this.deletedAt = userInfo.deletedAt;

    if (watchList) {
      this.watchList = watchList;
    }
  }

  static createFromDB(userInfo: UserConstructor): IUserModel {
    return new User(userInfo);
  }

  static createWithWatchList(userInfo: UserConstructor, watchList: UserWatchList[]): IUserModel {
    return new User(userInfo, watchList);
  }
}
