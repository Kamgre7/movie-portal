export const TYPES = {
  PasswordManagerToken: Symbol.for('IPasswordManager'),

  UserRepositoryToken: Symbol.for('IUserRepository'),
  UserServiceToken: Symbol.for('IUserService'),
  UserControllerToken: Symbol.for('IUserController'),

  MovieRepositoryToken: Symbol.for('IMovieRepository'),
  MovieServiceToken: Symbol.for('IMovieService'),
  MovieControllerToken: Symbol.for('IMovieController'),

  MovieDbAdapterToken: Symbol.for('IMovieDbAdapter'),
  MovieRatingRepositoryToken: Symbol.for('IMovieRatingRepository'),
  MovieRatingDbAdapterToken: Symbol.for('IMovieRatingDbAdapter'),

  ActorRepositoryToken: Symbol.for('IActorRepository'),
  ActorServiceToken: Symbol.for('IActorService'),
  ActorControllerToken: Symbol.for('IActorController'),

  ActorRatingRepositoryToken: Symbol.for('IActorRatingRepository'),
  ActorDbAdapterToken: Symbol.for('IActorDbAdapter'),
  ActorRatingDbAdapterToken: Symbol.for('IActorRatingDbAdapter'),

  ActorMoviesRepositoryToken: Symbol.for('IActorsMoviesRepository'),

  ErrorMapperToken: Symbol.for('IErrorMapper'),
};
