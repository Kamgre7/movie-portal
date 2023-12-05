import { inject, injectable } from 'inversify';
import dayjs from 'dayjs';
import { database } from '../../../database/database';
import { TYPES } from '../../../ioc/types/types';
import { IErrorMapper } from '../../../errors/errorMapper';
import { jwtConfig } from '../jwt/jwtConfig';

export type StringOrNull = string | null;

export type TokenInfo<T extends StringOrNull> = {
  userId: string;
  token: T;
  expireAt: T extends string ? Date : null;
  createdAt: T extends string ? Date : null;
};

export interface IRefreshTokenRepository {
  create(userId: string, refreshToken: string): Promise<TokenInfo<string>>;
  update(refreshToken: string, userId: string): Promise<TokenInfo<string>>;
  find(refreshToken: string): Promise<TokenInfo<string> | null>;
  softDelete(userId: string): Promise<TokenInfo<null>>;
}

@injectable()
export class RefreshTokenRepository implements IRefreshTokenRepository {
  private readonly refreshTokenTable = 'users_refresh_token';

  constructor(
    @inject(TYPES.ErrorMapperToken)
    private readonly errorMapper: IErrorMapper,
    private readonly db = database
  ) {}

  async find(refreshToken: string): Promise<TokenInfo<string> | null> {
    const token = await this.db
      .selectFrom(this.refreshTokenTable)
      .where('token', '=', refreshToken)
      .selectAll()
      .executeTakeFirst();

    return token ? (token as TokenInfo<string>) : null;
  }

  async create(userId: string, refreshToken: string): Promise<TokenInfo<string>> {
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

      return token as TokenInfo<string>;
    } catch (err) {
      throw this.errorMapper.mapRepositoryError(err);
    }
  }

  async update(refreshToken: string, userId: string): Promise<TokenInfo<string>> {
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

      return updatedToken as TokenInfo<string>;
    } catch (err) {
      throw this.errorMapper.mapRepositoryError(err);
    }
  }

  async softDelete(userId: string): Promise<TokenInfo<null>> {
    try {
      const updatedToken = await this.db
        .updateTable(this.refreshTokenTable)
        .set({
          token: null,
          createdAt: null,
          expireAt: null,
        })
        .where('users_refresh_token.userId', '=', userId)
        .returningAll()
        .executeTakeFirstOrThrow();

      return updatedToken as TokenInfo<null>;
    } catch (err) {
      throw this.errorMapper.mapRepositoryError(err);
    }
  }
}
