import { injectable } from 'inversify';
import { database } from '../../../database/database';
import { NewUser, User } from '../../../database/schemas/user.schema';
import { BadRequestError } from '../../../errors/badRequestError';
import { DbError, DbErrorCodes } from '../../../errors/dbError';
import { NoResultError } from 'kysely';

export interface IUserRepository {
  findById(id: string): Promise<User>;
  create(newUser: NewUser): Promise<string>;
}

@injectable()
export class UserRepository implements IUserRepository {
  constructor(private readonly db = database) {}

  async findById(id: string): Promise<User> {
    try {
      const user = await this.db
        .selectFrom('user')
        .where('id', '=', id)
        .selectAll()
        .executeTakeFirstOrThrow();

      return user;
    } catch (err) {
      if (err instanceof NoResultError) {
        throw new BadRequestError('User not found', 404);
      }
      throw this.mapError(err);
    }
  }

  async create(newUser: NewUser): Promise<string> {
    try {
      const { id } = await this.db
        .insertInto('user')
        .values(newUser)
        .returning('id')
        .executeTakeFirstOrThrow();

      return id;
    } catch (err) {
      throw this.mapError(err);
    }
  }

  private mapError(err: any): DbError {
    if (err.code === DbErrorCodes.UNIQUE_CONSTRAINT_VIOLATION) {
      return new DbError('User with this email already exists');
    }

    if (err.code === DbErrorCodes.NOT_NULL_VIOLATION) {
      return new DbError('Value cannot be null');
    }

    if (err.code === DbErrorCodes.FOREIGN_KEY_VIOLATION) {
      return new DbError('Relation not found');
    }

    return new DbError('Something went wrong, try again later', 500);
  }
}
