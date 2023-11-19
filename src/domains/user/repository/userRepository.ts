import { inject, injectable } from 'inversify';
import { database } from '../../../database/database';
import { IUserModel } from '../models/userModel';
import { NewUser } from '../schemas/createUserValidationSchema';
import { TYPES } from '../../../ioc/types/types';
import { IErrorMapper } from '../../../errors/errorMapper';
import { UserFactory } from './userFactory';

export type WatchListInfo = {
  userId: string;
  movieId: string;
};

export interface IUserRepository {
  findById(id: string): Promise<IUserModel | undefined>;
  create(newUser: NewUser): Promise<IUserModel>;
  addMovieToWatchList(watchListData: WatchListInfo): Promise<WatchListInfo>;
}

@injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @inject(TYPES.ErrorMapperToken)
    private readonly errorMapper: IErrorMapper,
    private readonly db = database
  ) {}

  async findById(id: string): Promise<IUserModel | undefined> {
    const user = await this.db
      .selectFrom('users')
      .where('id', '=', id)
      .selectAll()
      .executeTakeFirst();

    return user ? UserFactory.createUser(user) : undefined;
  }

  async create(newUser: NewUser): Promise<IUserModel> {
    try {
      const user = await this.db
        .insertInto('users')
        .values(newUser)
        .returningAll()
        .executeTakeFirstOrThrow();

      return UserFactory.createUser(user);
    } catch (err) {
      throw this.errorMapper.mapRepositoryError(err);
    }
  }

  async addMovieToWatchList(watchListData: WatchListInfo): Promise<WatchListInfo> {
    try {
      const watchList = await this.db
        .insertInto('users_movies_watchList')
        .values(watchListData)
        .returningAll()
        .executeTakeFirstOrThrow();

      return watchList;
    } catch (err) {
      throw this.errorMapper.mapRepositoryError(err);
    }
  }
}
