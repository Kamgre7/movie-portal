import { AppError } from './appError';

export class BadRequestError extends AppError {
  constructor(message: string, code: number = 400) {
    super(message, code);
  }
}
