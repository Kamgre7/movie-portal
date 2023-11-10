import { IMovieModel, Movie } from './movieModel';

export type actorsInfo = {
  actorId: string;
};

export interface IMovieWithActorsModel extends IMovieModel {
  actors: actorsInfo[];
}

export class MovieWithActors extends Movie implements IMovieWithActorsModel {
  actors: actorsInfo[];

  constructor(movieInfo: IMovieWithActorsModel) {
    super(movieInfo);
    this.actors = movieInfo.actors;
  }
}
