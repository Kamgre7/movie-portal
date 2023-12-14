import { Router } from 'express';
import { container } from '../../../ioc/inversify.config';
import { IActorController } from '../controllers/actorController';
import { TYPES } from '../../../ioc/types/types';
import { requestValidator } from '../../../middlewares/requestValidator';
import { CreateActorSchema } from '../schemas/createActorValidationSchema';
import { FindActorByCriteria, FindActorByIdSchema } from '../schemas/findActorValidationSchema';
import { RateActorSchema } from '../schemas/rateActorValidationSchema';
import { IAuth } from '../../../middlewares/auth';
import { IUserRoleValidator } from '../../../middlewares/userRoleValidator';

export const actorRouter = Router();

const actorController = container.get<IActorController>(TYPES.ActorControllerToken);
const authValidator = container.get<IAuth>(TYPES.AuthToken);
const userRoleValidator = container.get<IUserRoleValidator>(TYPES.UserRoleValidatorToken);

actorRouter
  .route('/')
  .post(
    authValidator.verifyUser,
    userRoleValidator.isAdmin,
    requestValidator(CreateActorSchema),
    actorController.create
  );

actorRouter
  .route('/search')
  .get(requestValidator(FindActorByCriteria), actorController.findByCriteria);

actorRouter
  .route('/:actorId/rate/movies/:movieId')
  .post(authValidator.verifyUser, requestValidator(RateActorSchema), actorController.rate)
  .patch(authValidator.verifyUser, requestValidator(RateActorSchema), actorController.updateRate);

actorRouter.route('/:id').get(requestValidator(FindActorByIdSchema), actorController.findById);
