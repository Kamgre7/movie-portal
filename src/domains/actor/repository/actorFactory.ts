import { Actor, IActorModel } from '../models/actorModel';

export class ActorFactory {
  private constructor() {}

  static createActor(actorInfo: IActorModel): Actor {
    return new Actor(actorInfo);
  }
}
