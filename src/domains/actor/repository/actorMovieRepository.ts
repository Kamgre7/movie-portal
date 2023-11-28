import { inject, injectable } from 'inversify';
import { database } from '../../../database/database';
import { TYPES } from '../../../ioc/types/types';
import { IErrorMapper } from '../../../errors/errorMapper';
import { NoResultError } from 'kysely';
import { BadRequestError } from '../../../errors/badRequestError';

export type ActorInMovie = {
  movieId: string;
  actorId: string;
};

export interface IActorsMoviesRepository {
  find(actorId: string, movieId: string): Promise<ActorInMovie>;
}

@injectable()
export class ActorsMoviesRepository implements IActorsMoviesRepository {
  private readonly actorsMoviesTable = 'actors_movies';

  constructor(
    @inject(TYPES.ErrorMapperToken)
    private readonly errorMapper: IErrorMapper,
    private readonly db = database
  ) {}

  async find(actorId: string, movieId: string): Promise<ActorInMovie> {
    try {
      const actorInMovie = await this.db
        .selectFrom(this.actorsMoviesTable)
        .where('actorId', '=', actorId)
        .where('movieId', '=', movieId)
        .selectAll()
        .executeTakeFirstOrThrow();

      return actorInMovie;
    } catch (err) {
      if (err instanceof NoResultError) {
        throw new BadRequestError('Actor not found in movie');
      }
      throw this.errorMapper.mapRepositoryError(err);
    }
  }
}
