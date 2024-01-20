import { inject, injectable } from 'inversify';
import { database } from '../../../database/database';
import { TYPES } from '../../../ioc/types/types';
import { IErrorMapper } from '../../../errors/errorMapper';

export type WatchListInfo = {
  userId: string;
  movieId: string;
};

export type UserWatchList = {
  movieId: string;
};

export interface IWatchListRepository {
  getAll(userId: string): Promise<UserWatchList[]>;
  addMovie(watchListData: WatchListInfo): Promise<UserWatchList>;
}

@injectable()
export class WatchListRepository implements IWatchListRepository {
  private readonly watchListTable = 'users_movies_watchList';

  constructor(
    @inject(TYPES.ErrorMapperToken)
    private readonly errorMapper: IErrorMapper,
    private readonly db = database,
  ) {}

  async getAll(userId: string): Promise<UserWatchList[]> {
    const movies = await this.db
      .selectFrom(this.watchListTable)
      .where('userId', '=', userId)
      .select(['movieId'])
      .execute();

    return movies;
  }

  async addMovie(watchListData: WatchListInfo): Promise<UserWatchList> {
    try {
      const movieToWatchList = await this.db
        .insertInto(this.watchListTable)
        .values(watchListData)
        .returning(['movieId'])
        .executeTakeFirstOrThrow();

      return movieToWatchList;
    } catch (err) {
      throw this.errorMapper.mapRepositoryError(err);
    }
  }
}
