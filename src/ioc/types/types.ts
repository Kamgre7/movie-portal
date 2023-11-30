export const TYPES = {
  PasswordManagerToken: Symbol.for('IPasswordManager'),

  UserRepositoryToken: Symbol.for('IUserRepository'),
  UserServiceToken: Symbol.for('IUserService'),
  UserControllerToken: Symbol.for('IUserController'),

  MovieRepositoryToken: Symbol.for('IMovieRepository'),
  MovieServiceToken: Symbol.for('IMovieService'),
  MovieControllerToken: Symbol.for('IMovieController'),
  MovieRatingRepositoryToken: Symbol.for('IMovieRatingRepository'),

  ActorRepositoryToken: Symbol.for('IActorRepository'),
  ActorServiceToken: Symbol.for('IActorService'),
  ActorControllerToken: Symbol.for('IActorController'),
  ActorRatingRepositoryToken: Symbol.for('IActorRatingRepository'),

  ActorMoviesRepositoryToken: Symbol.for('IActorsMoviesRepository'),

  ErrorMapperToken: Symbol.for('IErrorMapper'),
};
