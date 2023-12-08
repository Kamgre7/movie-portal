import { NextFunction, Request, Response } from 'express';
import { ROLE } from '../domains/user/types/userRole';
import { ForbiddenError } from '../errors/forbiddenError';

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  const user = res.locals.user;

  if (user && user.role === ROLE.ADMIN) {
    next();
  }

  throw new ForbiddenError('For admin only');
};
