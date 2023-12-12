import { JwtPayload, sign, verify } from 'jsonwebtoken';
import { UserPayload } from './jwtManager';
import { UnauthorizedError } from '../../../errors/unauthorizedError';
import { injectable } from 'inversify';

export interface IJwtCreator {
  generate(payload: UserPayload, secretToken: string, expiresIn: number): string;
  verify(token: string, secretToken: string): JwtPayload;
}

@injectable()
export class JwtCreator implements IJwtCreator {
  constructor() {}

  generate(payload: UserPayload, secretToken: string, expiresIn: number): string {
    return sign(payload, secretToken, { expiresIn });
  }

  verify(token: string, secretToken: string): JwtPayload {
    try {
      const payload = verify(token, secretToken) as JwtPayload;

      return payload;
    } catch (error) {
      throw new UnauthorizedError('Unauthorized');
    }
  }
}
