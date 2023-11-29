import { Response } from 'express';
import { inject, injectable } from 'inversify';
import { ParsedRequest } from '../../../apiTypes';
import { CreateMovieReq } from '../schemas/createMovieValidationSchema';
import { FindMovieByIdReq } from '../schemas/findMovieByIdValidationSchema';
import { TYPES } from '../../../ioc/types/types';
import { IMovieService } from '../services/movieService';
import { FindMovieByCriteriaReq } from '../schemas/findMovieByCriteriaValidationSchema';

export interface IMovieController {
  findById(req: ParsedRequest<FindMovieByIdReq>, res: Response): Promise<void>;
  findByCriteria(req: ParsedRequest<FindMovieByCriteriaReq>, res: Response): Promise<void>;
  create(req: ParsedRequest<CreateMovieReq>, res: Response): Promise<void>;
}

@injectable()
export class MovieController implements IMovieController {
  constructor(
    @inject(TYPES.MovieServiceToken)
    private readonly movieService: IMovieService
  ) {}

  findByCriteria = async (
    req: ParsedRequest<FindMovieByCriteriaReq>,
    res: Response
  ): Promise<void> => {
    const movies = await this.movieService.findByCriteria(req.query);

    res.status(200).json({
      movies,
    });
  };

  findById = async (req: ParsedRequest<FindMovieByIdReq>, res: Response): Promise<void> => {
    const movie = await this.movieService.findById(req.params.id);

    res.status(200).json({
      movie,
    });
  };

  create = async (req: ParsedRequest<CreateMovieReq>, res: Response): Promise<void> => {
    const movie = await this.movieService.create(req.body);

    res.status(201).json({
      movie,
    });
  };
}
