import { AppError } from './appError';

export class NotFoundError extends AppError {
  constructor(message: string, code: number = 404) {
    super(message, code);
  }
}
