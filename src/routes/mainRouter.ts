import { Router } from 'express';
import { userRouter } from '../domains/user/routes/userRouter';

export const mainRouter = Router();

mainRouter.use('/user', userRouter);
