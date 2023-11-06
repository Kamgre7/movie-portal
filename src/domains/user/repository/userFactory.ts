import { injectable } from 'inversify';
import { IUserModel, User } from '../models/userModel';

export interface IUserFactory {
  createUser(userInfo: IUserModel): User;
}

@injectable()
export class UserFactory implements IUserFactory {
  constructor() {}

  createUser(userInfo: IUserModel): User {
    return new User(userInfo);
  }
}
