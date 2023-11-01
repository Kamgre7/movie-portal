import { AppError } from './appError';

export const DbErrorCodes = {
  UNIQUE_CONSTRAINT_VIOLATION: '23505',
  FOREIGN_KEY_VIOLATION: '23503',
  NOT_NULL_VIOLATION: '23502',
};

export class DbError extends AppError {
  constructor(message: string, code: number = 500) {
    super(message, code);
  }
}
