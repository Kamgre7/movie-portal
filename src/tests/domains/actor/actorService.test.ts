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

describe('Actor service', () => {
  let actorInfo: NewActor;

  let errorMapper: IErrorMapper;
  let actorRatingRepository: IActorRatingRepository;
  let actorRepository: IActorRepository;
  let actorService: IActorService;
  let actorsMoviesRepository: IActorsMoviesRepository;

  beforeAll(async () => {
    errorMapper = new ErrorMapper();
    actorRatingRepository = new ActorRatingRepository(errorMapper, testDb);
    actorsMoviesRepository = new ActorsMoviesRepository(errorMapper, testDb);
    actorRepository = new ActorRepository(errorMapper, actorRatingRepository, testDb);
    actorService = new ActorService(actorRepository, actorRatingRepository, actorsMoviesRepository);
  });

  beforeEach(() => {
    actorInfo = {
      firstName: 'John',
      lastName: 'Example',
      gender: 'male',
    };
  });

  afterEach(async () => {
    await testDb.deleteFrom('actors').execute();
  });

  afterAll(async () => {
    await testDb.destroy();
  });

  describe('Actor', () => {
    it('Should return new actor', async () => {
      const actor = await actorService.create(actorInfo);

      expect(actor).toBeInstanceOf(Actor);
      expect(actor.lastName).toBe('Example');
    });

    it('Should find actor by id', async () => {
      const createdActor = await actorService.create(actorInfo);
      const foundActor = await actorService.findById(createdActor.id, false);

      expect(foundActor).toStrictEqual(createdActor);
    });

    it('Should find actor by criteria', async () => {
      const createdActor = await actorService.create(actorInfo);
      const [foundActor] = await actorService.findByCriteria({ lastName: 'Example' }, false);

      expect(foundActor).toStrictEqual(createdActor);
    });

    it('Should return empty array - actor not found by criteria', async () => {
      const createdActor = await actorService.create(actorInfo);
      const foundActor = await actorService.findByCriteria({ lastName: 'Test' }, false);

      expect(foundActor).toHaveLength(0);
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
  });
});
