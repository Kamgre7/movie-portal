import { inject, injectable } from 'inversify';
import { database } from '../../../database/database';
import { IUserModel } from '../models/userModel';
import { NewUser } from '../schemas/createUserValidationSchema';
import { TYPES } from '../../../ioc/types/types';
import { IErrorMapper } from '../../../errors/errorMapper';
import { UserFactory } from './userFactory';

export interface IUserRepository {
  findById(id: string): Promise<IUserModel | undefined>;
  create(newUser: NewUser): Promise<IUserModel>;
}

@injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @inject(TYPES.ErrorMapperToken)
    private readonly errorMapper: IErrorMapper,
    private readonly db = database
  ) {}

  async findById(id: string): Promise<IUserModel | undefined> {
    const user = await this.db
      .selectFrom('users')
      .where('id', '=', id)
      .selectAll()
      .executeTakeFirst();

    return user ? UserFactory.createUser(user) : undefined;
  }

  async create(newUser: NewUser): Promise<IUserModel> {
    try {
      const user = await this.db
        .insertInto('users')
        .values(newUser)
        .returningAll()
        .executeTakeFirstOrThrow();

      return UserFactory.createUser(user);
    } catch (err: any) {
      throw this.errorMapper.mapRepositoryError(err);
    }
  }
}
