import { Router } from 'express';
import { requestValidator } from '../../../middlewares/requestValidator';
import { CreateMovieSchema } from '../schemas/createMovieValidationSchema';
import { FindMovieByIdSchema } from '../schemas/findMovieByIdValidationSchema';
import { container } from '../../../ioc/inversify.config';
import { IMovieController } from '../controllers/movieController';
import { TYPES } from '../../../ioc/types/types';
import { FindMovieByCriteriaSchema } from '../schemas/findMovieByCriteriaValidationSchema';
import { IUserRoleValidator } from '../../../middlewares/userRoleValidator';
import { IAuth } from '../../../middlewares/auth';
import { RateMovieSchema } from '../schemas/rateMovieValidationSchema';
import { AddActorToMovieSchema } from '../schemas/addActorsToMovieValidationSchema';

export const movieRouter = Router();

const movieController = container.get<IMovieController>(TYPES.MovieControllerToken);
const authValidator = container.get<IAuth>(TYPES.AuthToken);
const userRoleValidator = container.get<IUserRoleValidator>(TYPES.UserRoleValidatorToken);

movieRouter
  .route('/')
  .post(
    authValidator.verifyUser,
    userRoleValidator.isAdmin,
    requestValidator(CreateMovieSchema),
    movieController.create,
  );

movieRouter
  .route('/rate/:id')
  .post(authValidator.verifyUser, requestValidator(RateMovieSchema), movieController.rate)
  .patch(authValidator.verifyUser, requestValidator(RateMovieSchema), movieController.updateRate);

movieRouter.route('/search').get(requestValidator(FindMovieByCriteriaSchema), movieController.findByCriteria);

movieRouter.route('/:id').get(requestValidator(FindMovieByIdSchema), movieController.findById);

movieRouter
  .route('/:id/actors')
  .post(
    authValidator.verifyUser,
    userRoleValidator.isAdmin,
    requestValidator(AddActorToMovieSchema),
    movieController.addActorsToMovie,
  );
