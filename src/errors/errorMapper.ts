import { injectable } from 'inversify';
import { BadRequestError } from './badRequestError';
import { DbError, DbErrorCodes } from './dbError';

export interface IErrorMapper {
  mapRepositoryError(error: any): BadRequestError | DbError;
}

@injectable()
export class ErrorMapper implements IErrorMapper {
  constructor() {}

  mapRepositoryError(err: any): BadRequestError | DbError {
    if (err.code === DbErrorCodes.UNIQUE_CONSTRAINT_VIOLATION) {
      return new BadRequestError(err.detail);
    }

    if (err.code === DbErrorCodes.NOT_NULL_VIOLATION) {
      return new BadRequestError(err.detail);
    }

    if (err.code === DbErrorCodes.FOREIGN_KEY_VIOLATION) {
      return new BadRequestError(err.detail);
    }

    return new DbError(err.detail);
  }
}
