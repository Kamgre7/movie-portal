import { inject, injectable } from 'inversify';
import { TYPES } from '../../../ioc/types/types';
import { IPasswordManager } from '../../passwordManager/passwordManager';
import { IUserRepository } from '../repository/userRepository';
import { NewUser, User } from '../../../database/schemas/user.schema';

export interface IUserService {
  create(newUser: Omit<NewUser, 'passwordSalt'>): Promise<string>;
  findById(id: string): Promise<User>;
}

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject(TYPES.PasswordManagerToken)
    private readonly passwordManager: IPasswordManager,
    @inject(TYPES.UserRepositoryToken)
    private readonly userRepository: IUserRepository
  ) {}

  async create(newUser: Omit<NewUser, 'passwordSalt'>): Promise<string> {
    const passwordSalt = await this.passwordManager.generateSalt();
    const password = await this.passwordManager.hashPwd(
      newUser.password,
      passwordSalt
    );

    const userId = await this.userRepository.create({
      ...newUser,
      passwordSalt,
      password,
    });

    return userId;
  }

  async findById(id: string): Promise<User> {
    return this.userRepository.findById(id);
  }
}
