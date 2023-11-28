import { inject, injectable } from 'inversify';
import { TYPES } from '../../../ioc/types/types';
import { IActorRepository } from '../repository/actorRepository';
import { NewActor } from '../schemas/createActorValidationSchema';
import { Actor, IActorModel } from '../models/actor';
import { ActorCriteria } from '../schemas/findActorValidationSchema';

export interface IActorDbAdapter {
  create(newActor: NewActor): Promise<IActorModel>;
  findByCriteria(criteria: ActorCriteria): Promise<IActorModel[]>;
  findById(id: string): Promise<IActorModel | null>;
}

@injectable()
export class ActorDatabaseAdapter implements IActorDbAdapter {
  constructor(
    @inject(TYPES.ActorRepositoryToken)
    private readonly actorRepository: IActorRepository
  ) {}

  async create(newActor: NewActor): Promise<IActorModel> {
    const actor = await this.actorRepository.create(newActor);

    return Actor.createFromDB(actor);
  }

  async findById(id: string): Promise<IActorModel | null> {
    const actor = await this.actorRepository.findById(id);

    return actor ? Actor.createFromDB(actor) : null;
  }

  async findByCriteria(criteria: ActorCriteria): Promise<IActorModel[]> {
    const actors = await this.actorRepository.findByCriteria(criteria);

    return actors.map((actor) => Actor.createFromDB(actor));
  }
}
