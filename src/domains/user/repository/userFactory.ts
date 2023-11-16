import { IUserModel, User } from '../models/userModel';

export class UserFactory {
  private constructor() {}

  static createUser(userInfo: IUserModel): User {
    return new User(userInfo);
  }
}
