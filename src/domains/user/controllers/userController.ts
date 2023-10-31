import { Response } from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../../ioc/types/types';
import { IUserService } from '../services/userService';
import { ParsedRequest } from '../../../apiTypes';
import { CreateUserReq } from '../schemas/createUserSchema';
import { FindUserByIdReq } from '../schemas/findUserByIdSchema';

export interface IUserController {
  findById(req: ParsedRequest<FindUserByIdReq>, res: Response): Promise<void>;
  create(req: ParsedRequest<CreateUserReq>, res: Response): Promise<void>;
}

@injectable()
export class UserController implements IUserController {
  constructor(
    @inject(TYPES.UserServiceToken)
    private readonly userService: IUserService
  ) {}

  findById = async (
    req: ParsedRequest<FindUserByIdReq>,
    res: Response
  ): Promise<void> => {
    const user = await this.userService.findById(req.params.id);

    res.status(200).json({
      user,
    });
  };

  create = async (
    req: ParsedRequest<CreateUserReq>,
    res: Response
  ): Promise<void> => {
    const { body } = req;

    const userId = await this.userService.create(body);

    res.status(201).json({
      userId,
    });
  };
}
