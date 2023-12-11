import { inject, injectable } from 'inversify';
import { database } from '../../../database/database';
import { TYPES } from '../../../ioc/types/types';
import { IErrorMapper } from '../../../errors/errorMapper';

export type ActorInMovie = {
  movieId: string;
  actorId: string;
};

export interface IActorsMoviesRepository {
  find(actorId: string, movieId: string): Promise<ActorInMovie | null>;
  findAll(movieId: string): Promise<ActorInMovie[]>;
  addActor(actorId: string, movieId: string): Promise<ActorInMovie>;
}

@injectable()
export class ActorsMoviesRepository implements IActorsMoviesRepository {
  private readonly actorsMoviesTable = 'actors_movies';

  constructor(
    @inject(TYPES.ErrorMapperToken)
    private readonly errorMapper: IErrorMapper,
    private readonly db = database
  ) {}

  async find(actorId: string, movieId: string): Promise<ActorInMovie | null> {
    const actorInMovie = await this.db
      .selectFrom(this.actorsMoviesTable)
      .where('actorId', '=', actorId)
      .where('movieId', '=', movieId)
      .selectAll()
      .executeTakeFirst();

    return actorInMovie ?? null;
  }

  async findAll(movieId: string): Promise<ActorInMovie[]> {
    const actorInMovie = await this.db
      .selectFrom(this.actorsMoviesTable)
      .where('movieId', '=', movieId)
      .selectAll()
      .execute();

    return actorInMovie;
  }

  async addActor(actorId: string, movieId: string): Promise<ActorInMovie> {
    try {
      const actor = await this.db
        .insertInto(this.actorsMoviesTable)
        .values({ actorId, movieId })
        .returningAll()
        .executeTakeFirstOrThrow();

      return actor;
    } catch (err) {
      throw this.errorMapper.mapRepositoryError(err);
    }
  }
}
