import 'reflect-metadata';
import 'express-async-errors';
import express, { Application } from 'express';
import { appConfig } from './config/appConfig';
import { errorHandler } from './middlewares/errorHandler';
import { mainRouter } from './routes/mainRouter';

export class Bootstrap {
  private readonly app: Application;

  constructor() {
    this.app = express();

    this.configureDefaultMiddleware();
    this.configureRoutes();
    this.configureErrorHandler();
    this.startServer();
  }

  private configureDefaultMiddleware(): void {
    this.app.use(express.json());
  }

  private configureRoutes(): void {
    this.app.use('/', mainRouter);
  }

  private configureErrorHandler(): void {
    this.app.use(errorHandler);
  }

  private startServer(): void {
    this.app.listen(appConfig.port, () => {
      console.log(`Application is running on ${appConfig.host}:${appConfig.port}`);
    });
  }
}

new Bootstrap();
