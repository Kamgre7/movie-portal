import { Router } from 'express';
import { container } from '../../../ioc/inversify.config';
import { IUserController } from '../controllers/userController';
import { TYPES } from '../../../ioc/types/types';
import { requestValidator } from '../../../middlewares/requestValidator';
import { CreateUserSchema } from '../schemas/createUserValidationSchema';
import { FindUserByIdSchema } from '../schemas/findUserByIdValidationSchema';
import {
  AddMovieToWatchListSchema,
  GetMovieWatchListSchema,
} from '../schemas/watchListValidationSchema';
import { IAuth } from '../../../middlewares/auth';

export const userRouter = Router();

const userController = container.get<IUserController>(TYPES.UserControllerToken);
const authValidator = container.get<IAuth>(TYPES.AuthToken);

userRouter.route('/').post(requestValidator(CreateUserSchema), userController.create);

userRouter
  .route('/:id')
  .get(authValidator.verifyUser, requestValidator(FindUserByIdSchema), userController.findById);

userRouter
  .route('/:id/watchlist')
  .get(
    authValidator.verifyUser,
    requestValidator(GetMovieWatchListSchema),
    userController.getMovieWatchList
  )
  .post(
    authValidator.verifyUser,
    requestValidator(AddMovieToWatchListSchema),
    userController.addMovieToWatchList
  );
