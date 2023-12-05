import { injectable } from 'inversify';
import { sign, verify } from 'jsonwebtoken';
import { jwtConfig } from './jwtConfig';
import { UnauthorizedError } from '../../../errors/unauthorizedError';

export interface UserPayload {
  id: string;
  email: string;
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

  constructor() {}

  createToken(payload: UserPayload): TokenPair {
    const accessToken = this.generateToken(
      payload,
      jwtConfig.jwtTokenSecret,
      this.accessTokenExpiresIn
    );

    const refreshToken = this.generateToken(
      payload,
      jwtConfig.jwtRefreshTokenSecret,
      this.refreshTokenExpiresIn
    );

    return { accessToken, refreshToken };
  }

  refreshToken(refreshToken: string): string {
    try {
      const payload = verify(refreshToken, jwtConfig.jwtRefreshTokenSecret) as UserPayload;

      const newAccessToken = this.generateToken(
        payload,
        jwtConfig.jwtTokenSecret,
        this.accessTokenExpiresIn
      );

      return newAccessToken;
    } catch (err) {
      throw new UnauthorizedError('Unauthorized');
    }
  }

  private generateToken(payload: UserPayload, secretToken: string, expiresIn: number): string {
    return sign(payload, secretToken, { expiresIn });
  }
}
