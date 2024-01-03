import { v4 as uuid } from 'uuid';
import { IMovieRepository } from '../../../domains/movie/repository/movieRepository';
import { NewMovie } from '../../../domains/movie/schemas/createMovieValidationSchema';
import { CATEGORY } from '../../../domains/movie/types/categoryType';
import { User } from '../../../domains/user/models/user';
import { IUserRepository } from '../../../domains/user/repository/userRepository';
import { IWatchListRepository } from '../../../domains/user/repository/watchilistRepository';
import { NewUser } from '../../../domains/user/schemas/createUserValidationSchema';
import { IUserService } from '../../../domains/user/services/userService';
import { GENDER } from '../../../domains/user/types/genderType';
import { testDb } from '../../testDatabase';
import { container } from '../../../ioc/inversify.config';
import { TYPES } from '../../../ioc/types/types';
import { database } from '../../../database/database';

describe('User service', () => {
  let userInfo: NewUser;
  let movieInfo: NewMovie;
  let movieRepository: IMovieRepository;
  let watchListRepository: IWatchListRepository;
  let userRepository: IUserRepository;
  let userService: IUserService;

  beforeAll(async () => {
    movieRepository = container.get<IMovieRepository>(TYPES.MovieRepositoryToken);
    watchListRepository = container.get<IWatchListRepository>(TYPES.UserWatchListRepositoryToken);
    userRepository = container.get<IUserRepository>(TYPES.UserRepositoryToken);
    userService = container.get<IUserService>(TYPES.UserServiceToken);
  });

  beforeEach(() => {
    movieInfo = {
      title: 'Film 1000',
      category: CATEGORY.ACTION,
      releaseDate: new Date('2020-09-20'),
    };

    userInfo = {
      email: 'test@mail.com',
      firstName: 'John',
      lastName: 'Test',
      gender: GENDER.MALE,
      password: '1234',
    };
  });

  afterEach(async () => {
    await testDb.deleteFrom('users_movies_watchList').execute();
    await testDb.deleteFrom('movies').execute();
    await testDb.deleteFrom('users').execute();
  });

  afterAll(async () => {
    await testDb.destroy();
    await database.destroy();
  });

  describe('User', () => {
    it('Should create a user', async () => {
      const user = await userService.create(userInfo);

      expect(user).toBeInstanceOf(User);
      expect(user.email).toBe(userInfo.email);
    });

    it('Should find user by id', async () => {
      const createdUser = await userRepository.create(userInfo);

      const foundUser = await userService.findById(createdUser.id);

      expect(createdUser).toStrictEqual(foundUser);
    });
  });

  describe('User watch list', () => {
    it('Should add movie to watch list', async () => {
      const user = await userRepository.create(userInfo);
      const movie = await movieRepository.create(movieInfo);

      const movieInWatchList = await userService.addMovieToWatchList({
        movieId: movie.id,
        userId: user.id,
      });

      expect(movieInWatchList.movieId).toBe(movie.id);
    });

    it('Should return user watch list', async () => {
      const user = await userRepository.create(userInfo);
      const movie = await movieRepository.create(movieInfo);

      await watchListRepository.addMovie({
        movieId: movie.id,
        userId: user.id,
      });

      const watchList = await userService.getWatchList(user.id);

      expect(watchList).toContainEqual({
        movieId: movie.id,
      });
    });

    it('Should return empty user watch list', async () => {
      const user = await userRepository.create(userInfo);
      const movie = await movieRepository.create(movieInfo);

      const watchList = await userService.getWatchList(user.id);

      expect(watchList).toHaveLength(0);
    });
  });

  describe('Should throw error when', () => {
    describe('User', () => {
      it('Should throw error when trying to create a user with the same email second time', async () => {
        await userService.create(userInfo);

        await expect(async () => {
          await userService.create(userInfo);
        }).rejects.toThrow();
      });

      it('Should throw error when user is not found by id', async () => {
        await expect(async () => {
          await userService.findById(uuid());
        }).rejects.toThrow();
      });
    });

    describe('User watch list', () => {
      it('Should throw error when trying to add movie to watch list which already exist', async () => {
        const user = await userRepository.create(userInfo);
        const movie = await movieRepository.create(movieInfo);

        await userService.addMovieToWatchList({
          movieId: movie.id,
          userId: user.id,
        });

        await expect(async () => {
          await userService.addMovieToWatchList({
            movieId: movie.id,
            userId: user.id,
          });
        }).rejects.toThrow();
      });

      it('Should throw error when trying to add movie which not exist', async () => {
        const user = await userRepository.create(userInfo);

        await expect(async () => {
          await userService.addMovieToWatchList({
            movieId: uuid(),
            userId: user.id,
          });
        }).rejects.toThrow();
      });

      it('Should throw error when trying to add movie by a user who does not exist', async () => {
        const movie = await movieRepository.create(movieInfo);

        await expect(async () => {
          await userService.addMovieToWatchList({
            movieId: movie.id,
            userId: uuid(),
          });
        }).rejects.toThrow();
      });
    });
  });
});
