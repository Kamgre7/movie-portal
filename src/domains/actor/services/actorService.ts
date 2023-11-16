import { inject, injectable } from 'inversify';
import { TYPES } from '../../../ioc/types/types';
import { NotFoundError } from '../../../errors/notFoundError';
import { NewActor } from '../schemas/createActorValidationSchema';
import { IActorModel } from '../models/actorModel';
import { IActorRepository } from '../repository/actorRepository';
import { ActorCriteria } from '../schemas/findActorValidationSchema';

export interface IActorService {
  create(newActor: NewActor): Promise<IActorModel>;
  findById(id: string): Promise<IActorModel>;
  findByCriteria(criteria: ActorCriteria): Promise<IActorModel[]>;
}

@injectable()
export class ActorService implements IActorService {
  constructor(
    @inject(TYPES.ActorRepositoryToken)
    private readonly actorRepository: IActorRepository
  ) {}

  async create(newActor: NewActor): Promise<IActorModel> {
    return this.actorRepository.create(newActor);
  }

  async findById(id: string): Promise<IActorModel> {
    const actor = await this.actorRepository.findById(id);

    if (!actor) {
      throw new NotFoundError('Actor not found');
    }

    return actor;
  }

  async findByCriteria(criteria: ActorCriteria): Promise<IActorModel[]> {
    const actors = await this.actorRepository.findByCriteria(criteria);

    if (!actors) {
      throw new NotFoundError('Actors not found');
    }

    return actors;
  }
}
