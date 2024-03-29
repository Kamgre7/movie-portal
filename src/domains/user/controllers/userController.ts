import { Response } from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../../ioc/types/types';
import { IUserService } from '../services/userService';
import { ParsedRequest } from '../../../apiTypes';
import { CreateUserReq } from '../schemas/createUserValidationSchema';
import { FindUserByIdReq } from '../schemas/findUserByIdValidationSchema';
import { AddMovieToWatchListReq, GetMovieWatchListReq } from '../schemas/watchListValidationSchema';

export interface IUserController {
  findById(req: ParsedRequest<FindUserByIdReq>, res: Response): Promise<void>;
  create(req: ParsedRequest<CreateUserReq>, res: Response): Promise<void>;

  addMovieToWatchList(req: ParsedRequest<AddMovieToWatchListReq>, res: Response): Promise<void>;
  getMovieWatchList(req: ParsedRequest<GetMovieWatchListReq>, res: Response): Promise<void>;
}

@injectable()
export class UserController implements IUserController {
  constructor(
    @inject(TYPES.UserServiceToken)
    private readonly userService: IUserService,
  ) {}

  findById = async (req: ParsedRequest<FindUserByIdReq>, res: Response): Promise<void> => {
    const user = await this.userService.findById(req.params.id);

    res.status(200).json({
      user,
    });
  };

  create = async (req: ParsedRequest<CreateUserReq>, res: Response): Promise<void> => {
    const user = await this.userService.create(req.body);

    res.status(201).json({
      user,
    });
  };

  addMovieToWatchList = async (req: ParsedRequest<AddMovieToWatchListReq>, res: Response): Promise<void> => {
    const { id: userId } = req.params;
    const { movieId } = req.body;

    const watchListInfo = await this.userService.addMovieToWatchList({ movieId, userId });

    res.status(201).json({
      watchListInfo,
    });
  };

  getMovieWatchList = async (req: ParsedRequest<GetMovieWatchListReq>, res: Response): Promise<void> => {
    const user = res.locals.user;

    const watchList = await this.userService.getWatchList(user.id);

    res.status(200).json({
      watchList,
    });
  };
}
