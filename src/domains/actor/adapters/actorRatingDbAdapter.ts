import { inject, injectable } from 'inversify';
import { TYPES } from '../../../ioc/types/types';
import { ActorInMovieRating, IActorRatingRepository } from '../repository/actorRatingRepository';
import { ActorRating, IActorRatingModel } from '../models/actorRating';

export interface IActorRatingDbAdapter {
  rate(actorRateInfo: ActorInMovieRating): Promise<IActorRatingModel>;
  update(actorRateInfo: ActorInMovieRating): Promise<IActorRatingModel>;
  find(actorId: string): Promise<IActorRatingModel[]>;
}

@injectable()
export class ActorRatingDbAdapter implements IActorRatingDbAdapter {
  constructor(
    @inject(TYPES.ActorRatingRepositoryToken)
    private readonly actorRatingRepository: IActorRatingRepository
  ) {}

  async rate(actorRateInfo: ActorInMovieRating): Promise<IActorRatingModel> {
    const rating = await this.actorRatingRepository.rate(actorRateInfo);

    return ActorRating.createFromDB(rating);
  }

  async update(actorRateInfo: ActorInMovieRating): Promise<IActorRatingModel> {
    const rating = await this.actorRatingRepository.update(actorRateInfo);

    return ActorRating.createFromDB(rating);
  }

  async find(actorId: string): Promise<IActorRatingModel[]> {
    const ratings = await this.actorRatingRepository.find(actorId);

    return ratings.map((rating) => ActorRating.createFromDB(rating));
  }
}
