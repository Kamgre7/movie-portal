import { ActorsTable } from './actors.schema';
import { ActorsMoviesTable } from './actorsMovies.schema';
import { MoviesTable } from './movies.schema';
import { UsersTable } from './users.schema';
import { UsersActorsRatingsTable } from './usersActors.schema';
import { UsersMoviesRatingsTable } from './usersMovies.schema';

export interface Database {
  users: UsersTable;
  movies: MoviesTable;
  actors: ActorsTable;
  actors_movies: ActorsMoviesTable;
  users_movies_ratings: UsersMoviesRatingsTable;
  users_actors_ratings: UsersActorsRatingsTable;
}
