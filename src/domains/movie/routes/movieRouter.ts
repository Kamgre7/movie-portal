import { Router } from 'express';
import { requestValidator } from '../../../middlewares/requestValidator';
import { CreateMovieSchema } from '../schemas/createMovieSchema';
import { FindMovieByIdSchema } from '../schemas/findMovieByIdSchema';
import { container } from '../../../ioc/inversify.config';
import { IMovieController } from '../controllers/movieController';
import { TYPES } from '../../../ioc/types/types';
import { RateMovieSchema } from '../schemas/rateMovieSchema';
import { AddActorMovieSchema } from '../schemas/addActorsMovieSchema';
import { FindMovieByCriteriaSchema } from '../schemas/findMovieByCriteriaSchema';

export const movieRouter = Router();

const movieController = container.get<IMovieController>(
  TYPES.MovieControllerToken
);

movieRouter
  .route('/')
  .post(requestValidator(CreateMovieSchema), movieController.create);

movieRouter
  .route('/search')
  .get(
    requestValidator(FindMovieByCriteriaSchema),
    movieController.findByCriteria
  );

movieRouter
  .route('/:id/rate')
  .get(requestValidator(FindMovieByIdSchema), movieController.findWithRating)
  .post(requestValidator(RateMovieSchema), movieController.rate)
  .patch(requestValidator(RateMovieSchema), movieController.updateRate);

movieRouter
  .route('/:id/actors')
  .get(requestValidator(FindMovieByIdSchema), movieController.findWithActors)
  .post(requestValidator(AddActorMovieSchema), movieController.addActors);

movieRouter
  .route('/:id')
  .get(requestValidator(FindMovieByIdSchema), movieController.findById);
