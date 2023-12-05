import { Router } from 'express';
import { container } from '../../../ioc/inversify.config';
import { TYPES } from '../../../ioc/types/types';
import { IAuthController } from '../controllers/authController';
import { requestValidator } from '../../../middlewares/requestValidator';
import { LoginSchema } from '../schemas/loginValidationSchema';
import { auth } from '../../../middlewares/auth';
import { RefreshTokenSchema } from '../schemas/refreshTokenValidationSchema';

export const authRouter = Router();

const authController = container.get<IAuthController>(TYPES.AuthControllerToken);

authRouter.route('/login').post(requestValidator(LoginSchema), authController.login);

authRouter.route('/logout').delete(auth, authController.logout);

authRouter
  .route('/token/refresh')
  .post(requestValidator(RefreshTokenSchema), authController.refreshToken);
