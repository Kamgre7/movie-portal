import { Router } from 'express';
import { container } from '../../../ioc/inversify.config';
import { IUserController } from '../controllers/userController';
import { TYPES } from '../../../ioc/types/types';
import { requestValidator } from '../../../middlewares/requestValidator';
import { CreateUserSchema } from '../schemas/createUserValidationSchema';
import { FindUserByIdSchema } from '../schemas/findUserByIdValidationSchema';

export const userRouter = Router();

const userController = container.get<IUserController>(TYPES.UserControllerToken);

userRouter.route('/').post(requestValidator(CreateUserSchema), userController.create);

userRouter.route('/:id').get(requestValidator(FindUserByIdSchema), userController.findById);
