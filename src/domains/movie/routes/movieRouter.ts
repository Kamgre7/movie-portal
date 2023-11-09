import { Router } from 'express';
import { requestValidator } from '../../../middlewares/requestValidator';
import { CreateMovieSchema } from '../schemas/createMovieSchema';
import { FindMovieByIdSchema } from '../schemas/findMovieByIdSchema';
import { container } from '../../../ioc/inversify.config';
import { IMovieController } from '../controllers/movieController';
import { TYPES } from '../../../ioc/types/types';
import { RateMovieSchema } from '../schemas/rateMovieSchema';

export const movieRouter = Router();

const movieController = container.get<IMovieController>(
  TYPES.MovieControllerToken
);

movieRouter
  .route('/')
  .post(requestValidator(CreateMovieSchema), movieController.create);

movieRouter
  .route('/:id/rate')
  .post(requestValidator(RateMovieSchema), movieController.rate)
  .patch(requestValidator(RateMovieSchema), movieController.updateRate);

movieRouter
  .route('/:id')
  .get(requestValidator(FindMovieByIdSchema), movieController.findById);