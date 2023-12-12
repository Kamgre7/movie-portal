import { inject, injectable } from 'inversify';
import { jwtConfig } from './jwtConfig';
import { UnauthorizedError } from '../../../errors/unauthorizedError';
import { RoleType } from '../../user/types/userRole';
import { TYPES } from '../../../ioc/types/types';
import { IJwtCreator } from './jwtCreator';

export interface UserPayload {
  id: string;
  email: string;
  role: RoleType;
}

export type TokenPair = {
  accessToken: string;
  refreshToken: string;
};

export interface IJwtManager {
  createToken(payload: UserPayload): TokenPair;
  refreshToken(refreshToken: string): string;
}

@injectable()
export class JwtManager implements IJwtManager {
  private readonly accessTokenExpiresIn = jwtConfig.jwtTokenExpireInDays * 60 * 60 * 24;
  private readonly refreshTokenExpiresIn = jwtConfig.jwtRefreshTokenExpireInDays * 60 * 60 * 24;

  constructor(
    @inject(TYPES.JwtCreatorToken)
    private readonly jwtCreator: IJwtCreator
  ) {}

  createToken(payload: UserPayload): TokenPair {
    const accessToken = this.jwtCreator.generate(
      payload,
      jwtConfig.jwtTokenSecret,
      this.accessTokenExpiresIn
    );

    const refreshToken = this.jwtCreator.generate(
      payload,
      jwtConfig.jwtRefreshTokenSecret,
      this.refreshTokenExpiresIn
    );

    return { accessToken, refreshToken };
  }

  refreshToken(refreshToken: string): string {
    try {
      const payload = this.jwtCreator.verify(refreshToken, jwtConfig.jwtRefreshTokenSecret);

      const newAccessToken = this.jwtCreator.generate(
        { email: payload.email, id: payload.id, role: payload.role },
        jwtConfig.jwtTokenSecret,
        this.accessTokenExpiresIn
      );

      return newAccessToken;
    } catch (err) {
      throw new UnauthorizedError('Unauthorized');
    }
  }
}
