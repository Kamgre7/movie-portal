import { inject, injectable } from 'inversify';
import { database } from '../../../database/database';
import { IUserModel, User } from '../models/user';
import { NewUser } from '../schemas/createUserValidationSchema';
import { TYPES } from '../../../ioc/types/types';
import { IErrorMapper } from '../../../errors/errorMapper';

export interface IUserRepository {
  findById(id: string): Promise<IUserModel | null>;
  findByEmail(id: string): Promise<IUserModel | null>;
  create(newUser: NewUser): Promise<IUserModel>;
}

@injectable()
export class UserRepository implements IUserRepository {
  private readonly usersTable = 'users';

  constructor(
    @inject(TYPES.ErrorMapperToken)
    private readonly errorMapper: IErrorMapper,
    private readonly db = database
  ) {}

  async findById(id: string): Promise<IUserModel | null> {
    const user = await this.db
      .selectFrom(this.usersTable)
      .where('id', '=', id)
      .selectAll()
      .executeTakeFirst();

    return user ? User.createBasic(user) : null;
  }

  async findByEmail(email: string): Promise<IUserModel | null> {
    const user = await this.db
      .selectFrom(this.usersTable)
      .where('email', '=', email)
      .selectAll()
      .executeTakeFirst();

    return user ? User.createBasic(user) : null;
  }

  async create(newUser: NewUser): Promise<IUserModel> {
    try {
      const user = await this.db
        .insertInto('users')
        .values(newUser)
        .returningAll()
        .executeTakeFirstOrThrow();

      return User.createBasic(user);
    } catch (err) {
      throw this.errorMapper.mapRepositoryError(err);
    }
  }
}
