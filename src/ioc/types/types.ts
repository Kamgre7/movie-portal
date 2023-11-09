export const TYPES = {
  PasswordManagerToken: Symbol.for('IPasswordManager'),

  UserRepositoryToken: Symbol.for('IUserRepository'),
  UserServiceToken: Symbol.for('IUserService'),
  UserControllerToken: Symbol.for('IUserController'),
  UserFactoryToken: Symbol.for('IUserFactory'),

  MovieFactoryToken: Symbol.for('IMovieFactory'),
  MovieRepositoryToken: Symbol.for('IMovieRepository'),
  MovieServiceToken: Symbol.for('IMovieService'),
  MovieControllerToken: Symbol.for('IMovieController'),

  ActorRepositoryToken: Symbol.for('IActorRepository'),
  ActorServiceToken: Symbol.for('IActorService'),
  ActorControllerToken: Symbol.for('IActorController'),

  ErrorMapperToken: Symbol.for('IErrorMapper'),
};
