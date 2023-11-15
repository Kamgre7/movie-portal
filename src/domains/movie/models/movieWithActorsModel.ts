import { IMovieModel, Movie } from './movieModel';

export interface IMovieWithActorsModel extends IMovieModel {
  actors: {
    actorId: string;
  }[];
}

export class MovieWithActors extends Movie implements IMovieWithActorsModel {
  actors: {
    actorId: string;
  }[];

  constructor(movieInfo: IMovieWithActorsModel) {
    super(movieInfo);
    this.actors = movieInfo.actors;
  }
}
