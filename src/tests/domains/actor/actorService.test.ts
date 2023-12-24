import { v4 as uuid } from 'uuid';
import { ActorService, IActorService } from '../../../domains/actor/services/actorService';
import {
  ActorRepository,
  IActorRepository,
} from '../../../domains/actor/repository/actorRepository';
import { ErrorMapper, IErrorMapper } from '../../../errors/errorMapper';
import {
  ActorRatingRepository,
  IActorRatingRepository,
} from '../../../domains/actor/repository/actorRatingRepository';
import {
  ActorsMoviesRepository,
  IActorsMoviesRepository,
} from '../../../domains/actor/repository/actorMovieRepository';
import { Actor } from '../../../domains/actor/models/actor';
import { testDb } from '../../testDatabase';
import { NewActor } from '../../../domains/actor/schemas/createActorValidationSchema';
import { CATEGORY } from '../../../domains/movie/types/categoryType';
import { GENDER } from '../../../domains/user/types/genderType';
import { NewMovie } from '../../../domains/movie/schemas/createMovieValidationSchema';
import { NewUser } from '../../../domains/user/schemas/createUserValidationSchema';
import {
  IMovieRepository,
  MovieRepository,
} from '../../../domains/movie/repository/movieRepository';
import { IUserRepository, UserRepository } from '../../../domains/user/repository/userRepository';
import {
  IMovieRatingRepository,
  MovieRatingRepository,
} from '../../../domains/movie/repository/movieRatingRepository';
import { MovieService } from '../../../domains/movie/services/movieService';
import { ActorRating } from '../../../domains/actor/models/actorRating';

describe('Actor service', () => {
  let actorInfo: NewActor;
  let movieInfo: NewMovie;
  let userInfo: NewUser;
  let movieRatingRepository: IMovieRatingRepository;
  let errorMapper: IErrorMapper;
  let movieRepository: IMovieRepository;
  let userRepository: IUserRepository;
  let actorRatingRepository: IActorRatingRepository;
  let actorRepository: IActorRepository;
  let actorService: IActorService;
  let actorsMoviesRepository: IActorsMoviesRepository;

  beforeAll(async () => {
    errorMapper = new ErrorMapper();
    userRepository = new UserRepository(errorMapper, testDb);
    actorRatingRepository = new ActorRatingRepository(errorMapper, testDb);
    actorsMoviesRepository = new ActorsMoviesRepository(errorMapper, testDb);
    actorRepository = new ActorRepository(errorMapper, actorRatingRepository, testDb);
    movieRatingRepository = new MovieRatingRepository(errorMapper, testDb);
    movieRepository = new MovieRepository(
      errorMapper,
      movieRatingRepository,
      actorsMoviesRepository,
      testDb
    );
    actorService = new ActorService(actorRepository, actorRatingRepository, actorsMoviesRepository);
  });

  beforeEach(() => {
    actorInfo = {
      firstName: 'John',
      lastName: 'Example',
      gender: 'male',
    };

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
    await testDb.deleteFrom('users_actors_ratings').execute();
    await testDb.deleteFrom('actors_movies').execute();
    await testDb.deleteFrom('actors').execute();
    await testDb.deleteFrom('movies').execute();
    await testDb.deleteFrom('users').execute();
  });

  afterAll(async () => {
    await testDb.destroy();
  });

  describe('Actor', () => {
    it('Should return new actor', async () => {
      const actor = await actorService.create(actorInfo);

      expect(actor).toBeInstanceOf(Actor);
      expect(actor.lastName).toBe(actorInfo.lastName);
    });

    it('Should find actor by id', async () => {
      const createdActor = await actorRepository.create(actorInfo);
      const foundActor = await actorService.findById(createdActor.id, false);

      expect(foundActor).toStrictEqual(createdActor);
    });

    it('Should find actor by criteria', async () => {
      const createdActor = await actorRepository.create(actorInfo);
      const [foundActor] = await actorService.findByCriteria(
        { lastName: actorInfo.lastName },
        false
      );

      expect(foundActor).toStrictEqual(createdActor);
    });

    it('Should return empty array - actor not found by criteria', async () => {
      await actorRepository.create(actorInfo);
      const foundActor = await actorService.findByCriteria({ lastName: 'Test' }, false);

      expect(foundActor).toHaveLength(0);
    });
  });

  describe('Rate actor', () => {
    it('Should add rating to actor', async () => {
      const actor = await actorRepository.create(actorInfo);
      const movie = await movieRepository.create(movieInfo);
      const user = await userRepository.create(userInfo);

      await actorsMoviesRepository.addActor(actor.id, movie.id);

      const rate = await actorService.rate({
        actorId: actor.id,
        movieId: movie.id,
        rating: 3,
        userId: user.id,
      });

      expect(rate).toBeInstanceOf(ActorRating);
      expect(rate.rating).toBe(3);
      expect(rate.userId).toBe(user.id);
      expect(rate.movieId).toBe(movie.id);
    });

    it("Should update actor's rating", async () => {
      const actor = await actorRepository.create(actorInfo);
      const movie = await movieRepository.create(movieInfo);
      const user = await userRepository.create(userInfo);

      await actorsMoviesRepository.addActor(actor.id, movie.id);

      const rate = await actorRatingRepository.rate({
        actorId: actor.id,
        movieId: movie.id,
        rating: 3,
        userId: user.id,
      });

      const updatedRate = await actorService.updateRate({
        actorId: actor.id,
        movieId: movie.id,
        rating: 1,
        userId: user.id,
      });

      expect(rate.rating).toBe(3);
      expect(updatedRate.rating).toBe(1);
    });
  });

  describe('Actor with rating', () => {
    it('Should return actor with rating', async () => {
      const actor = await actorRepository.create(actorInfo);
      const movie = await movieRepository.create(movieInfo);
      const user = await userRepository.create(userInfo);

      await actorsMoviesRepository.addActor(actor.id, movie.id);

      const rate = await actorRatingRepository.rate({
        actorId: actor.id,
        movieId: movie.id,
        rating: 3,
        userId: user.id,
      });

      const foundActor = await actorRepository.findById(actor.id, true);

      expect(foundActor?.rating).toContainEqual({
        userId: user.id,
        movieId: movie.id,
        rating: rate.rating,
      });
    });

    it('Should return empty array in actor rating - rating not found', async () => {
      const actor = await actorRepository.create(actorInfo);
      const movie = await movieRepository.create(movieInfo);

      await actorsMoviesRepository.addActor(actor.id, movie.id);

      const foundActor = await actorRepository.findById(actor.id, true);

      expect(foundActor?.rating).toHaveLength(0);
    });
  });

  describe('Should throw error when', () => {
    describe('Actor', () => {
      it('Should throw error when actor is not found by id', async () => {
        await actorService.create(actorInfo);

        await expect(async () => {
          await actorService.findById('123', false);
        }).rejects.toThrow();
      });
    });

    describe('Rate actor', () => {
      it('Should throw error when actor is not found in movie actors list', async () => {
        const movie = await movieRepository.create(movieInfo);
        const user = await userRepository.create(userInfo);

        await expect(async () => {
          await actorService.rate({
            actorId: uuid(),
            movieId: movie.id,
            rating: 3,
            userId: user.id,
          });
        }).rejects.toThrow();
      });

      it('Should throw error when user is not found', async () => {
        const movie = await movieRepository.create(movieInfo);
        const actor = await actorRepository.create(actorInfo);

        await expect(async () => {
          await actorService.rate({
            actorId: actor.id,
            movieId: movie.id,
            rating: 3,
            userId: uuid(),
          });
        }).rejects.toThrow();
      });

      it('Should throw error when movie is not found', async () => {
        const actor = await actorRepository.create(actorInfo);
        const user = await userRepository.create(userInfo);

        await expect(async () => {
          await actorService.rate({
            actorId: actor.id,
            movieId: uuid(),
            rating: 3,
            userId: user.id,
          });
        }).rejects.toThrow();
      });

      it("Should throw error when when trying update actor's rating which not exist", async () => {
        const actor = await actorRepository.create(actorInfo);
        const user = await userRepository.create(userInfo);

        await expect(async () => {
          await actorService.updateRate({
            actorId: actor.id,
            movieId: uuid(),
            rating: 3,
            userId: user.id,
          });
        }).rejects.toThrow();
      });
    });
  });
});
