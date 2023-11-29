import { inject, injectable } from 'inversify';
import { TYPES } from '../../../ioc/types/types';
import { NotFoundError } from '../../../errors/notFoundError';
import { NewActor } from '../schemas/createActorValidationSchema';
import { IActorModel } from '../models/actor';
import { ActorCriteria } from '../schemas/findActorValidationSchema';
import { ActorInMovieRating } from '../repository/actorRatingRepository';
import { IActorDbAdapter } from '../adapters/actorDbAdapter';
import { IActorRatingDbAdapter } from '../adapters/actorRatingDbAdapter';
import { IActorRatingModel } from '../models/actorRating';
import { BadRequestError } from '../../../errors/badRequestError';
import { IActorsMoviesRepository } from '../repository/actorMovieRepository';

export interface IActorService {
  create(newActor: NewActor): Promise<IActorModel>;
  findById(id: string, withRating: boolean): Promise<IActorModel>;
  findByCriteria(criteria: ActorCriteria, withRating: boolean): Promise<IActorModel[]>;

  rate(rateInfo: ActorInMovieRating): Promise<IActorRatingModel>;
  updateRate(rateInfo: ActorInMovieRating): Promise<IActorRatingModel>;
}

@injectable()
export class ActorService implements IActorService {
  constructor(
    @inject(TYPES.ActorDbAdapterToken)
    private readonly actorDbAdapter: IActorDbAdapter,
    @inject(TYPES.ActorRatingDbAdapterToken)
    private readonly actorRatingDbAdapter: IActorRatingDbAdapter,
    @inject(TYPES.ActorMoviesRepositoryToken)
    private readonly actorMoviesRepository: IActorsMoviesRepository
  ) {}

  async create(newActor: NewActor): Promise<IActorModel> {
    const existingActor = await this.findByCriteria(
      {
        firstName: newActor.firstName,
        lastName: newActor.lastName,
      },
      false
    );

    if (existingActor.length) {
      throw new BadRequestError('Actor already exists');
    }

    const actor = await this.actorDbAdapter.create(newActor);

    return actor;
  }

  async findById(id: string, withRating: boolean): Promise<IActorModel> {
    const actor = await this.actorDbAdapter.findById(id);

    if (!actor) {
      throw new NotFoundError('Actor not found');
    }

    if (withRating) {
      actor.rating = await this.actorRatingDbAdapter.find(id);
    }

    return actor;
  }

  async findByCriteria(criteria: ActorCriteria, withRating: boolean): Promise<IActorModel[]> {
    const actors = await this.actorDbAdapter.findByCriteria(criteria);

    if (withRating) {
      const actorsRating = await Promise.all(
        actors.map((actor) => this.actorRatingDbAdapter.find(actor.id))
      );

      actors.map((actor, index) => (actor.rating = actorsRating[index]));
    }

    return actors;
  }

  async rate(rateInfo: ActorInMovieRating): Promise<IActorRatingModel> {
    const actorInMovieExist = await this.actorMoviesRepository.find(
      rateInfo.actorId,
      rateInfo.movieId
    );

    if (!actorInMovieExist) {
      throw new BadRequestError('Actor in movie not found');
    }

    return await this.actorRatingDbAdapter.rate(rateInfo);
  }

  async updateRate(rateInfo: ActorInMovieRating): Promise<IActorRatingModel> {
    return this.actorRatingDbAdapter.update(rateInfo);
  }
}
