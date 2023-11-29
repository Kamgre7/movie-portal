import { Router } from 'express';
import { requestValidator } from '../../../middlewares/requestValidator';
import { CreateMovieSchema } from '../schemas/createMovieValidationSchema';
import { FindMovieByIdSchema } from '../schemas/findMovieByIdValidationSchema';
import { container } from '../../../ioc/inversify.config';
import { IMovieController } from '../controllers/movieController';
import { TYPES } from '../../../ioc/types/types';
import { FindMovieByCriteriaSchema } from '../schemas/findMovieByCriteriaValidationSchema';

export const movieRouter = Router();

const movieController = container.get<IMovieController>(TYPES.MovieControllerToken);

movieRouter.route('/').post(requestValidator(CreateMovieSchema), movieController.create);

movieRouter
  .route('/search')
  .get(requestValidator(FindMovieByCriteriaSchema), movieController.findByCriteria);

movieRouter.route('/:id').get(requestValidator(FindMovieByIdSchema), movieController.findById);
