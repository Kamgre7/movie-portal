import { inject, injectable } from 'inversify';
import { database } from '../../../database/database';
import { BadRequestError } from '../../../errors/badRequestError';
import { DbError, DbErrorCodes } from '../../../errors/dbError';
import { IUserModel } from '../models/userModel';
import { NewUser } from '../schemas/createUserSchema';
import { TYPES } from '../../../ioc/types/types';
import { IUserFactory } from './userFactory';

export interface IUserRepository {
  findById(id: string): Promise<IUserModel | undefined>;
  create(newUser: NewUser): Promise<IUserModel>;
}

@injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @inject(TYPES.UserFactoryToken)
    private readonly userFactory: IUserFactory,
    private readonly db = database
  ) {}

  async findById(id: string): Promise<IUserModel | undefined> {
    const user = await this.db
      .selectFrom('user')
      .where('id', '=', id)
      .selectAll()
      .executeTakeFirst();

    return user ? this.userFactory.createUser(user) : undefined;
  }

  async create(newUser: NewUser): Promise<IUserModel> {
    try {
      const user = await this.db
        .insertInto('user')
        .values(newUser)
        .returningAll()
        .executeTakeFirstOrThrow();

      return this.userFactory.createUser(user);
    } catch (err: any) {
      throw this.mapError(err);
    }
  }

  private mapError(err: any): BadRequestError | DbError {
    if (err.code === DbErrorCodes.UNIQUE_CONSTRAINT_VIOLATION) {
      return new BadRequestError(err.detail);
    }

    if (err.code === DbErrorCodes.NOT_NULL_VIOLATION) {
      return new BadRequestError(err.detail);
    }

    return new DbError(err.detail);
  }
}
