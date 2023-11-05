import { Router } from 'express';
import { userRouter } from '../domains/user/routes/userRouter';
import { movieRouter } from '../domains/movie/routes/movieRouter';

export const mainRouter = Router();

mainRouter.use('/user', userRouter);
mainRouter.use('/movie', movieRouter);
