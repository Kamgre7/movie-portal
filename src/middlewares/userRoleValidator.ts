import { NextFunction, Request, Response } from 'express';
import { ROLE } from '../domains/user/types/userRole';
import { ForbiddenError } from '../errors/forbiddenError';
import { injectable } from 'inversify';

export interface IUserRoleValidator {
  isAdmin(req: Request, res: Response, next: NextFunction): void;
}

@injectable()
export class UserRoleValidator implements IUserRoleValidator {
  constructor() {}

  isAdmin = (req: Request, res: Response, next: NextFunction): void => {
    const user = res.locals.user;

    if (user && user.role === ROLE.ADMIN) {
      next();
    } else {
      throw new ForbiddenError('For admin only');
    }
  };
}
