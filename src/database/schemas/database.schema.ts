import { ActorTable } from './actor.schema';
import { ActorMovieTable } from './actorMovie.schema';
import { MovieTable } from './movie.schema';
import { UserTable } from './user.schema';

export interface Database {
  user: UserTable;
  movie: MovieTable;
  actor: ActorTable;
  actor_movie: ActorMovieTable;
}
