import { Router } from 'express';
import { container } from '../../../ioc/inversify.config';
import { IActorController } from '../controllers/actorController';
import { TYPES } from '../../../ioc/types/types';
import { requestValidator } from '../../../middlewares/requestValidator';
import { CreateActorSchema } from '../schemas/createActorSchema';
import { FindActorByIdSchema } from '../schemas/findActorSchema';

export const actorRouter = Router();

const actorController = container.get<IActorController>(
  TYPES.ActorControllerToken
);

actorRouter
  .route('/')

  .post(requestValidator(CreateActorSchema), actorController.create);

actorRouter
  .route('/:id')

  .get(requestValidator(FindActorByIdSchema), actorController.findById);
