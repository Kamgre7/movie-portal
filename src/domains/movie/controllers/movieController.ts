import { Response } from 'express';
import { inject, injectable } from 'inversify';
import { ParsedRequest } from '../../../apiTypes';
import { CreateMovieReq } from '../schemas/createMovieSchema';
import { FindMovieByIdReq } from '../schemas/findMovieByIdSchema';
import { TYPES } from '../../../ioc/types/types';
import { IMovieService } from '../services/movieService';
import { RateMovieReq } from '../schemas/rateMovieSchema';
import { AddActorMovieReq } from '../schemas/addActorsMovieSchema';
import { FindMovieByCriteriaReq } from '../schemas/findMovieByCriteriaSchema';

export interface IMovieController {
  findById(req: ParsedRequest<FindMovieByIdReq>, res: Response): Promise<void>;
  findByCriteria(
    req: ParsedRequest<FindMovieByCriteriaReq>,
    res: Response
  ): Promise<void>;
  create(req: ParsedRequest<CreateMovieReq>, res: Response): Promise<void>;
  rate(req: ParsedRequest<RateMovieReq>, res: Response): Promise<void>;
  updateRate(req: ParsedRequest<RateMovieReq>, res: Response): Promise<void>;
  findWithRating(
    req: ParsedRequest<FindMovieByIdReq>,
    res: Response
  ): Promise<void>;
  findWithActors(
    req: ParsedRequest<FindMovieByIdReq>,
    res: Response
  ): Promise<void>;
  addActors(req: ParsedRequest<AddActorMovieReq>, res: Response): Promise<void>;
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

  findWithRating = async (
    req: ParsedRequest<FindMovieByIdReq>,
    res: Response
  ): Promise<void> => {
    const movie = await this.movieService.findWithRating(req.params.id);

    res.status(200).json({
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

  findWithActors = async (
    req: ParsedRequest<FindMovieByIdReq>,
    res: Response
  ) => {
    const movie = await this.movieService.findWithActors(req.params.id);

    res.status(200).json({
      movie,
    });
  };

  addActors = async (req: ParsedRequest<AddActorMovieReq>, res: Response) => {
    const insertedRows = await this.movieService.addActors(
      req.params.id,
      req.body.actorIds
    );

    res.status(201).json({
      insertedRows,
    });
  };
}
