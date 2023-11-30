import { Container } from 'inversify';
import { IPasswordManager, PasswordManager } from '../domains/passwordManager/passwordManager';
import { TYPES } from './types/types';
import { IUserRepository, UserRepository } from '../domains/user/repository/userRepository';
import { IUserService, UserService } from '../domains/user/services/userService';
import { IUserController, UserController } from '../domains/user/controllers/userController';
import { IMovieRepository, MovieRepository } from '../domains/movie/repository/movieRepository';
import { IMovieService, MovieService } from '../domains/movie/services/movieService';
import { IMovieController, MovieController } from '../domains/movie/controllers/movieController';
import { ActorRepository, IActorRepository } from '../domains/actor/repository/actorRepository';
import { ActorService, IActorService } from '../domains/actor/services/actorService';
import { ActorController, IActorController } from '../domains/actor/controllers/actorController';
import { ErrorMapper, IErrorMapper } from '../errors/errorMapper';
import {
  ActorRatingRepository,
  IActorRatingRepository,
} from '../domains/actor/repository/actorRatingRepository';
import {
  ActorsMoviesRepository,
  IActorsMoviesRepository,
} from '../domains/actor/repository/actorMovieRepository';
import {
  IMovieRatingRepository,
  MovieRatingRepository,
} from '../domains/movie/repository/movieRatingRepository';

export const container = new Container();

// password manager
container.bind<IPasswordManager>(TYPES.PasswordManagerToken).to(PasswordManager);

// users
container.bind<IUserService>(TYPES.UserServiceToken).to(UserService);
container.bind<IUserRepository>(TYPES.UserRepositoryToken).to(UserRepository);
container.bind<IUserController>(TYPES.UserControllerToken).to(UserController);

// movies
container.bind<IMovieRepository>(TYPES.MovieRepositoryToken).to(MovieRepository);
container.bind<IMovieService>(TYPES.MovieServiceToken).to(MovieService);
container.bind<IMovieController>(TYPES.MovieControllerToken).to(MovieController);

//movies_rating
container.bind<IMovieRatingRepository>(TYPES.MovieRatingRepositoryToken).to(MovieRatingRepository);

// actors
container.bind<IActorRepository>(TYPES.ActorRepositoryToken).to(ActorRepository);
container.bind<IActorService>(TYPES.ActorServiceToken).to(ActorService);
container.bind<IActorController>(TYPES.ActorControllerToken).to(ActorController);

//actors_rating
container.bind<IActorRatingRepository>(TYPES.ActorRatingRepositoryToken).to(ActorRatingRepository);

//actors_movies
container
  .bind<IActorsMoviesRepository>(TYPES.ActorMoviesRepositoryToken)
  .to(ActorsMoviesRepository);

// errorMapper
container.bind<IErrorMapper>(TYPES.ErrorMapperToken).to(ErrorMapper);
