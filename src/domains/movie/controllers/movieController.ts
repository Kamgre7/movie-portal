import { Response } from 'express';
import { inject, injectable } from 'inversify';
import { ParsedRequest } from '../../../apiTypes';
import { CreateMovieReq } from '../schemas/createMovieSchema';
import { FindMovieByIdReq } from '../schemas/findMovieByIdSchema';
import { TYPES } from '../../../ioc/types/types';
import { IMovieService } from '../services/movieService';
import { RateMovieReq } from '../schemas/rateMovieSchema';

export interface IMovieController {
  findById(req: ParsedRequest<FindMovieByIdReq>, res: Response): Promise<void>;
  create(req: ParsedRequest<CreateMovieReq>, res: Response): Promise<void>;
  rate(req: ParsedRequest<RateMovieReq>, res: Response): Promise<void>;
  updateRate(req: ParsedRequest<RateMovieReq>, res: Response): Promise<void>;
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

  rate = async (
    req: ParsedRequest<RateMovieReq>,
    res: Response
  ): Promise<void> => {
    const { id } = req.params;
    const { rate, userId } = req.body;

    const movieInfo = await this.movieService.rate(id, userId, rate);

    res.status(201).json({
      movieInfo,
    });
  };

  updateRate = async (
    req: ParsedRequest<RateMovieReq>,
    res: Response
  ): Promise<void> => {
    const { id } = req.params;
    const { rate, userId } = req.body;

    await this.movieService.updateRate(id, userId, rate);

    res.status(204).end();
  };
}
