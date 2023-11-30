import { inject, injectable } from 'inversify';
import { TYPES } from '../../../ioc/types/types';
import { NotFoundError } from '../../../errors/notFoundError';
import { NewActor } from '../schemas/createActorValidationSchema';
import { IActorModel } from '../models/actor';
import { ActorCriteria } from '../schemas/findActorValidationSchema';
import { ActorInMovieRating, IActorRatingRepository } from '../repository/actorRatingRepository';
import { IActorRatingModel } from '../models/actorRating';
import { BadRequestError } from '../../../errors/badRequestError';
import { IActorsMoviesRepository } from '../repository/actorMovieRepository';
import { IActorRepository } from '../repository/actorRepository';

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
    @inject(TYPES.ActorRepositoryToken)
    private readonly actorRepository: IActorRepository,
    @inject(TYPES.ActorRatingRepositoryToken)
    private readonly actorRatingRepository: IActorRatingRepository,
    @inject(TYPES.ActorMoviesRepositoryToken)
    private readonly actorMoviesRepository: IActorsMoviesRepository
  ) {}

  async create(newActor: NewActor): Promise<IActorModel> {
    return this.actorRepository.create(newActor);
  }

  async findById(id: string, withRating: boolean): Promise<IActorModel> {
    const actor = await this.actorRepository.findById(id, withRating);

    if (!actor) {
      throw new NotFoundError('Actor not found');
    }
    return actor;
  }

  async findByCriteria(criteria: ActorCriteria, withRating: boolean): Promise<IActorModel[]> {
    const actors = await this.actorRepository.findByCriteria(criteria, withRating);

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

    return await this.actorRatingRepository.rate(rateInfo);
  }

  async updateRate(rateInfo: ActorInMovieRating): Promise<IActorRatingModel> {
    return this.actorRatingRepository.update(rateInfo);
  }
}
