import { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from '../errors/unauthorizedError';
import { JwtPayload, verify } from 'jsonwebtoken';
import { jwtConfig } from '../domains/auth/jwt/jwtConfig';

export const auth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];

  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    throw new UnauthorizedError('Unauthorized');
  }

  try {
    const payload = verify(token, jwtConfig.jwtTokenSecret) as JwtPayload;

    res.locals.user = {
      id: payload.id,
      email: payload.email,
      role: payload.role,
    };
  } catch (err) {
    throw new UnauthorizedError('Unauthorized');
  }

  next();
};
