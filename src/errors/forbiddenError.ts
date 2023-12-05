import { AppError } from './appError';

export class ForbiddenError extends AppError {
  constructor(message: string, code: number = 403) {
    super(message, code);
  }
}
