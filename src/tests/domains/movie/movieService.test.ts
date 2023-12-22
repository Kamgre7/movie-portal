import { v4 as uuid } from 'uuid';
import {
  ActorsMoviesRepository,
  IActorsMoviesRepository,
} from '../../../domains/actor/repository/actorMovieRepository';
import { Movie } from '../../../domains/movie/models/movie';
import {
  IMovieRatingRepository,
  MovieRatingRepository,
} from '../../../domains/movie/repository/movieRatingRepository';
import {
  IMovieRepository,
  MovieRepository,
} from '../../../domains/movie/repository/movieRepository';
import { NewMovie } from '../../../domains/movie/schemas/createMovieValidationSchema';
import { IMovieService, MovieService } from '../../../domains/movie/services/movieService';
import { CATEGORY } from '../../../domains/movie/types/categoryType';
import { ErrorMapper, IErrorMapper } from '../../../errors/errorMapper';
import { testDb } from '../../testDatabase';
import { IUserRepository, UserRepository } from '../../../domains/user/repository/userRepository';
import { GENDER } from '../../../domains/user/types/genderType';
import { NewUser } from '../../../domains/user/schemas/createUserValidationSchema';
import { MovieRating } from '../../../domains/movie/models/movieRating';

describe('Movie service', () => {
  let movieInfo: NewMovie;
  let userInfo: NewUser;
  let errorMapper: IErrorMapper;
  let movieRepository: IMovieRepository;
  let movieRatingRepository: IMovieRatingRepository;
  let actorsMoviesRepository: IActorsMoviesRepository;
  let movieService: IMovieService;
  let userRepository: IUserRepository;

  beforeAll(async () => {
    errorMapper = new ErrorMapper();

    movieRatingRepository = new MovieRatingRepository(errorMapper, testDb);
    actorsMoviesRepository = new ActorsMoviesRepository(errorMapper, testDb);
    movieRepository = new MovieRepository(
      errorMapper,
      movieRatingRepository,
      actorsMoviesRepository,
      testDb
    );
    userRepository = new UserRepository(errorMapper, testDb);
    actorsMoviesRepository = new ActorsMoviesRepository(errorMapper, testDb);
    movieService = new MovieService(movieRepository, movieRatingRepository, actorsMoviesRepository);
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
    await testDb.deleteFrom('users_movies_ratings').execute();
    await testDb.deleteFrom('movies').execute();
    await testDb.deleteFrom('users').execute();
  });

  afterAll(async () => {
    await testDb.destroy();
  });

  describe('Movie', () => {
    it('Should return new movie', async () => {
      const movie = await movieService.create(movieInfo);

      expect(movie).toBeInstanceOf(Movie);
      expect(movie.title).toBe(movieInfo.title);
    });

    it('Should find movie by id', async () => {
      const createdMovie = await movieRepository.create(movieInfo);

      const foundMovie = await movieService.findById(createdMovie.id, {
        withActors: false,
        withRating: false,
      });

      expect(foundMovie).toStrictEqual(createdMovie);
    });

    it('Should find movie by criteria', async () => {
      const createdMovie = await movieRepository.create(movieInfo);

      const [foundMovie] = await movieService.findByCriteria(
        { title: movieInfo.title },
        {
          withActors: false,
          withRating: false,
        }
      );

      expect(createdMovie).toStrictEqual(foundMovie);
    });

    it('Should return empty array - movie not found by criteria', async () => {
      await movieRepository.create(movieInfo);

      const foundMovie = await movieService.findByCriteria(
        { title: 'Example' },
        { withActors: false, withRating: false }
      );

      expect(foundMovie).toHaveLength(0);
    });
  });

  describe('Movie rating', () => {
    it('Should rate movie', async () => {
      const movie = await movieRepository.create(movieInfo);
      const user = await userRepository.create(userInfo);

      const rate = await movieService.rate({
        movieId: movie.id,
        userId: user.id,
        rating: 5,
      });

      expect(rate).toBeInstanceOf(MovieRating);
      expect(rate.rating).toBe(5);
      expect(rate.userId).toBe(user.id);
    });

    it("Should update movie's rating", async () => {
      const movie = await movieRepository.create(movieInfo);
      const user = await userRepository.create(userInfo);

      const rate = await movieRatingRepository.rate({
        movieId: movie.id,
        userId: user.id,
        rating: 5,
      });

      const updatedRate = await movieService.updateRate({
        movieId: movie.id,
        userId: user.id,
        rating: 1,
      });

      expect(rate.rating).toBe(5);
      expect(updatedRate.rating).toBe(1);
    });
  });

  describe('Should throw error when', () => {
    describe('Movie', () => {
      it('Should throw error when trying to create a movie with the same title second time', async () => {
        await movieRepository.create(movieInfo);

        await expect(async () => {
          await movieService.create(movieInfo);
        }).rejects.toThrow();
      });

      it('Should throw error when movie is not found by id', async () => {
        await expect(async () => {
          await movieService.findById(uuid(), { withActors: false, withRating: false });
        }).rejects.toThrow();
      });
    });

    describe('Movie rating', () => {
      it('Should throw error when user want to rate with userId, which not exist in db', async () => {
        const movie = await movieRepository.create(movieInfo);

        await expect(async () => {
          await movieService.rate({
            movieId: movie.id,
            userId: uuid(),
            rating: 5,
          });
        }).rejects.toThrow();
      });

      it('Should throw error when user want to rate movie, which not exist in db', async () => {
        const user = await userRepository.create(userInfo);

        await expect(async () => {
          await movieService.rate({
            movieId: uuid(),
            userId: user.id,
            rating: 5,
          });
        }).rejects.toThrow();
      });

      it("Should throw error when trying update movie's rating which not exist", async () => {
        const movie = await movieRepository.create(movieInfo);
        const user = await userRepository.create(userInfo);

        await expect(async () => {
          await movieService.updateRate({
            movieId: movie.id,
            userId: user.id,
            rating: 5,
          });
        }).rejects.toThrow();
      });
    });
  });
});
