import { Router } from 'express';
import { container } from '../../../ioc/inversify.config';
import { IActorController } from '../controllers/actorController';
import { TYPES } from '../../../ioc/types/types';
import { requestValidator } from '../../../middlewares/requestValidator';
import { CreateActorSchema } from '../schemas/createActorValidationSchema';
import { FindActorByCriteria, FindActorByIdSchema } from '../schemas/findActorValidationSchema';
import { RateActorSchema } from '../schemas/rateActorValidationSchema';

export const actorRouter = Router();

const actorController = container.get<IActorController>(TYPES.ActorControllerToken);

actorRouter.route('/').post(requestValidator(CreateActorSchema), actorController.create);

actorRouter
  .route('/search')
  .get(requestValidator(FindActorByCriteria), actorController.findByCriteria);

actorRouter
  .route('/:actorId/rate/movies/:movieId')
  .post(requestValidator(RateActorSchema), actorController.rate)
  .patch(requestValidator(RateActorSchema), actorController.updateRate);

actorRouter.route('/:id').get(requestValidator(FindActorByIdSchema), actorController.findById);
