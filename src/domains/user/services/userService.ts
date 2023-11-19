import { inject, injectable } from 'inversify';
import { TYPES } from '../../../ioc/types/types';
import { IPasswordManager } from '../../passwordManager/passwordManager';
import { IUserRepository, WatchListInfo } from '../repository/userRepository';
import { NewUser } from '../schemas/createUserValidationSchema';
import { IUserModel } from '../models/userModel';
import { NotFoundError } from '../../../errors/notFoundError';

export interface IUserService {
  create(newUser: NewUser): Promise<IUserModel>;
  findById(id: string): Promise<IUserModel>;
  addMovieToWatchList(watchListData: WatchListInfo): Promise<WatchListInfo>;
}

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject(TYPES.PasswordManagerToken)
    private readonly passwordManager: IPasswordManager,
    @inject(TYPES.UserRepositoryToken)
    private readonly userRepository: IUserRepository
  ) {}

  async create(newUser: NewUser): Promise<IUserModel> {
    const passwordSalt = await this.passwordManager.generateSalt();
    const password = await this.passwordManager.hashPwd(newUser.password, passwordSalt);

    const user = await this.userRepository.create({
      ...newUser,
      password,
    });

    return user;
  }

  async findById(id: string): Promise<IUserModel> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return user;
  }

  async addMovieToWatchList(watchListData: WatchListInfo): Promise<WatchListInfo> {
    return this.userRepository.addMovieToWatchList(watchListData);
  }
}
