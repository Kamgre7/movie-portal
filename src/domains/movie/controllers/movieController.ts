import { Response } from 'express';
import { inject, injectable } from 'inversify';
import { ParsedRequest } from '../../../apiTypes';
import { CreateMovieReq } from '../schemas/createMovieSchema';
import { FindMovieByIdReq } from '../schemas/findMovieByIdSchema';
import { TYPES } from '../../../ioc/types/types';
import { IMovieService } from '../services/movieService';

export interface IMovieController {
  findById(req: ParsedRequest<FindMovieByIdReq>, res: Response): Promise<void>;
  create(req: ParsedRequest<CreateMovieReq>, res: Response): Promise<void>;
}

@injectable()
export class MovieController implements IMovieController {
  constructor(
    @inject(TYPES.MovieServiceToken)
    private readonly movieService: IMovieService
  ) {}

  findById = async (
    req: ParsedRequest<FindMovieByIdReq>,
    res: Response
  ): Promise<void> => {
    const movie = await this.movieService.findById(req.params.id);

    res.status(200).json({
      movie,
    });
  };

  create = async (
    req: ParsedRequest<CreateMovieReq>,
    res: Response
  ): Promise<void> => {
    const { body } = req;

    const movie = await this.movieService.create(body);

    res.status(201).json({
      movie,
    });
  };
}
