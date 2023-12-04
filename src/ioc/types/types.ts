export const TYPES = {
  PasswordManagerToken: Symbol.for('IPasswordManager'),

  AuthServiceToken: Symbol.for('IAuthService'),
  AuthControllerToken: Symbol.for('IAuthController'),
  JwtManagerToken: Symbol.for('IJwtManager'),
  RefreshTokenRepositoryToken: Symbol.for('IRefreshTokenRepository'),

  UserRepositoryToken: Symbol.for('IUserRepository'),
  UserServiceToken: Symbol.for('IUserService'),
  UserControllerToken: Symbol.for('IUserController'),

  UserWatchListRepositoryToken: Symbol.for('IWatchListRepository'),

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
