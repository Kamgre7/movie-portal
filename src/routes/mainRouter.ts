import { Router } from 'express';
import { userRouter } from '../domains/user/routes/userRouter';
import { movieRouter } from '../domains/movie/routes/movieRouter';
import { actorRouter } from '../domains/actor/routes/actorRoutes';
import { authRouter } from '../domains/auth/routes/authRoutes';

export const mainRouter = Router();

mainRouter.use('/users', userRouter);
mainRouter.use('/movies', movieRouter);
mainRouter.use('/actors', actorRouter);
mainRouter.use('/auth', authRouter);
