import { inject, injectable } from 'inversify';
import { database } from '../../../database/database';
import { IUserModel, User } from '../models/user';
import { NewUser } from '../schemas/createUserValidationSchema';
import { TYPES } from '../../../ioc/types/types';
import { IErrorMapper } from '../../../errors/errorMapper';

export type WatchListInfo = {
  userId: string;
  movieId: string;
};

export interface IUserRepository {
  findById(id: string): Promise<IUserModel | null>;
  findByEmail(id: string): Promise<IUserModel | null>;
  create(newUser: NewUser): Promise<IUserModel>;
  addMovieToWatchList(watchListData: WatchListInfo): Promise<WatchListInfo>;
}

@injectable()
export class UserRepository implements IUserRepository {
  private readonly usersTable = 'users';

  constructor(
    @inject(TYPES.ErrorMapperToken)
    private readonly errorMapper: IErrorMapper,
    private readonly db = database
  ) {}

  async findById(id: string): Promise<IUserModel | null> {
    const user = await this.db
      .selectFrom(this.usersTable)
      .where('id', '=', id)
      .selectAll()
      .executeTakeFirst();

    return user ? User.createFromDB(user) : null;
  }

  async findByEmail(email: string): Promise<IUserModel | null> {
    const user = await this.db
      .selectFrom(this.usersTable)
      .where('email', '=', email)
      .selectAll()
      .executeTakeFirst();

    return user ? User.createFromDB(user) : null;
  }

  async create(newUser: NewUser): Promise<IUserModel> {
    try {
      const user = await this.db
        .insertInto('users')
        .values(newUser)
        .returningAll()
        .executeTakeFirstOrThrow();

      return User.createFromDB(user);
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
