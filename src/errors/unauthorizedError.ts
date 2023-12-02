import { AppError } from './appError';

export class UnauthorizedError extends AppError {
  constructor(message: string, code: number = 401) {
    super(message, code);
  }
}
