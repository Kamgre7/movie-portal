import { inject, injectable } from 'inversify';
import dayjs from 'dayjs';
import { database } from '../../../database/database';
import { TYPES } from '../../../ioc/types/types';
import { IErrorMapper } from '../../../errors/errorMapper';
import { jwtConfig } from '../jwt/jwtConfig';

export type TokenInfo = {
  userId: string;
  token: string;
  expireAt: Date;
  createdAt: Date;
};

export interface IRefreshTokenRepository {
  create(userId: string, refreshToken: string): Promise<TokenInfo>;
  update(refreshToken: string, userId: string): Promise<TokenInfo>;
  find(userId: string): Promise<TokenInfo | null>;
}

@injectable()
export class RefreshTokenRepository implements IRefreshTokenRepository {
  private readonly refreshTokenTable = 'users_refresh_token';

  constructor(
    @inject(TYPES.ErrorMapperToken)
    private readonly errorMapper: IErrorMapper,
    private readonly db = database
  ) {}

  async find(userId: string): Promise<TokenInfo | null> {
    const token = await this.db
      .selectFrom(this.refreshTokenTable)
      .where('userId', '=', userId)
      .selectAll()
      .executeTakeFirst();

    return token ?? null;
  }

  async create(userId: string, refreshToken: string): Promise<TokenInfo> {
    try {
      const token = await this.db
        .insertInto(this.refreshTokenTable)
        .values({
          token: refreshToken,
          userId,
          expireAt: dayjs().add(jwtConfig.jwtRefreshTokenExpireInDays, 'day').toDate(),
          createdAt: new Date(),
        })
        .returningAll()
        .executeTakeFirstOrThrow();

      return token;
    } catch (err) {
      throw this.errorMapper.mapRepositoryError(err);
    }
  }

  async update(refreshToken: string, userId: string): Promise<TokenInfo> {
    try {
      const updatedToken = await this.db
        .updateTable(this.refreshTokenTable)
        .set({
          token: refreshToken,
          createdAt: new Date(),
          expireAt: dayjs().add(jwtConfig.jwtRefreshTokenExpireInDays, 'day').toDate(),
        })
        .where('users_refresh_token.userId', '=', userId)
        .returningAll()
        .executeTakeFirstOrThrow();

      return updatedToken;
    } catch (err) {
      throw this.errorMapper.mapRepositoryError(err);
    }
  }
}
