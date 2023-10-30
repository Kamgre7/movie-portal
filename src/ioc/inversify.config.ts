import { Container } from 'inversify';
import {
  IPasswordManager,
  PasswordManager,
} from '../domains/passwordManager/passwordManager';
import { TYPES } from './types/types';
import {
  IUserRepository,
  UserRepository,
} from '../domains/user/repository/userRepository';
import {
  IUserService,
  UserService,
} from '../domains/user/services/userService';
import {
  IUserController,
  UserController,
} from '../domains/user/controllers/userController';

export const container = new Container();

// password manager

container
  .bind<IPasswordManager>(TYPES.PasswordManagerToken)
  .to(PasswordManager);

// user

container.bind<IUserService>(TYPES.UserServiceToken).to(UserService);

container.bind<IUserRepository>(TYPES.UserRepositoryToken).to(UserRepository);

container.bind<IUserController>(TYPES.UserControllerToken).to(UserController);
