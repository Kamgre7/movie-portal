import { inject, injectable } from 'inversify';
import { database } from '../../../database/database';
import { IUserModel } from '../models/userModel';
import { NewUser } from '../schemas/createUserSchema';
import { TYPES } from '../../../ioc/types/types';
import { IUserFactory } from './userFactory';
import { IErrorMapper } from '../../../errors/errorMapper';

export interface IUserRepository {
  findById(id: string): Promise<IUserModel | undefined>;
  create(newUser: NewUser): Promise<IUserModel>;
}

@injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @inject(TYPES.UserFactoryToken)
    private readonly userFactory: IUserFactory,
    @inject(TYPES.ErrorMapperToken)
    private readonly errorMapper: IErrorMapper,
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
      throw this.errorMapper.mapRepositoryError(err);
    }
  }
}
