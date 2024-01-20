import { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from '../errors/unauthorizedError';
import { inject, injectable } from 'inversify';
import { TYPES } from '../ioc/types/types';
import { IJwtCreator } from '../domains/auth/jwt/jwtCreator';
import { jwtConfig } from '../domains/auth/jwt/jwtConfig';

export interface IAuth {
  verifyUser(req: Request, res: Response, next: NextFunction): void;
}

@injectable()
export class Auth implements IAuth {
  constructor(
    @inject(TYPES.JwtCreatorToken)
    private readonly jwtCreator: IJwtCreator,
  ) {}

  verifyUser = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers['authorization'];

    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      throw new UnauthorizedError('Unauthorized');
    }

    const payload = this.jwtCreator.verify(token, jwtConfig.jwtTokenSecret);

    res.locals.user = {
      id: payload.id,
      email: payload.email,
      role: payload.role,
    };

    next();
  };
}
