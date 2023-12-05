import { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from '../errors/unauthorizedError';
import { verify } from 'jsonwebtoken';
import { jwtConfig } from '../domains/auth/jwt/jwtConfig';
import { UserPayload } from '../domains/auth/jwt/jwtManager';

export const auth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];

  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    throw new UnauthorizedError('Unauthorized');
  }

  try {
    const user = verify(token, jwtConfig.jwtTokenSecret) as UserPayload;
    res.locals.user = user;
  } catch (err) {
    throw new UnauthorizedError('Unauthorized');
  }

  next();
};
