import { Router } from 'express';
import { container } from '../../../ioc/inversify.config';
import { TYPES } from '../../../ioc/types/types';
import { IAuthController } from '../controllers/authController';
import { requestValidator } from '../../../middlewares/requestValidator';
import { LoginSchema } from '../schemas/loginValidationSchema';
import { RefreshTokenSchema } from '../schemas/refreshTokenValidationSchema';
import { IAuth } from '../../../middlewares/auth';

export const authRouter = Router();

const authController = container.get<IAuthController>(TYPES.AuthControllerToken);
const authValidator = container.get<IAuth>(TYPES.AuthToken);

authRouter.route('/login').post(requestValidator(LoginSchema), authController.login);

authRouter.route('/logout').delete(authValidator.verifyUser, authController.logout);

authRouter
  .route('/token/refresh')
  .post(authValidator.verifyUser, requestValidator(RefreshTokenSchema), authController.refreshToken);
