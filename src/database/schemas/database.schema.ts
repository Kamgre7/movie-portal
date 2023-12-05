import { ActorsTable } from './actors.schema';
import { ActorsMoviesTable } from './actorsMovies.schema';
import { MoviesTable } from './movies.schema';
import { RefreshTokensTable } from './refreshToken.schema';
import { UsersTable } from './users.schema';
import { UsersActorsRatingsTable } from './usersActors.schema';
import { UsersMoviesRatingsTable } from './usersMovies.schema';
import { UsersMoviesWatchListTable } from './usersMoviesWatchlist.schema';

export interface Database {
  users: UsersTable;
  movies: MoviesTable;
  actors: ActorsTable;
  actors_movies: ActorsMoviesTable;
  users_movies_ratings: UsersMoviesRatingsTable;
  users_actors_ratings: UsersActorsRatingsTable;
  users_movies_watchList: UsersMoviesWatchListTable;
  users_refresh_token: RefreshTokensTable;
}
