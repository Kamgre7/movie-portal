import { Response } from 'express';
import { inject, injectable } from 'inversify';
import { ParsedRequest } from '../../../apiTypes';
import { CreateMovieReq } from '../schemas/createMovieValidationSchema';
import { FindMovieByIdReq } from '../schemas/findMovieByIdValidationSchema';
import { TYPES } from '../../../ioc/types/types';
import { IMovieService } from '../services/movieService';
import { RateMovieReq } from '../schemas/rateMovieValidationSchema';
import { AddActorMovieReq } from '../schemas/addActorsToMovieValidationSchema';
import { FindMovieByCriteriaReq } from '../schemas/findMovieByCriteriaValdiationSchema';
import { RateActorReq } from '../schemas/rateActorValidationSchema';

export interface IMovieController {
  findById(req: ParsedRequest<FindMovieByIdReq>, res: Response): Promise<void>;
  findByCriteria(req: ParsedRequest<FindMovieByCriteriaReq>, res: Response): Promise<void>;
  create(req: ParsedRequest<CreateMovieReq>, res: Response): Promise<void>;
  rate(req: ParsedRequest<RateMovieReq>, res: Response): Promise<void>;
  updateRate(req: ParsedRequest<RateMovieReq>, res: Response): Promise<void>;
  findWithRating(req: ParsedRequest<FindMovieByIdReq>, res: Response): Promise<void>;
  findWithActors(req: ParsedRequest<FindMovieByIdReq>, res: Response): Promise<void>;
  rateActor(req: ParsedRequest<RateActorReq>, res: Response): Promise<void>;
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

  findWithRating = async (req: ParsedRequest<FindMovieByIdReq>, res: Response): Promise<void> => {
    const movie = await this.movieService.findWithRating(req.params.id);

    res.status(200).json({
      movie,
    });
  };

  rate = async (req: ParsedRequest<RateMovieReq>, res: Response): Promise<void> => {
    const rating = {
      movieId: req.params.id,
      ...req.body,
    };

    const ratingInfo = await this.movieService.rate(rating);

    res.status(201).json({
      ratingInfo,
    });
  };

  updateRate = async (req: ParsedRequest<RateMovieReq>, res: Response): Promise<void> => {
    const rating = {
      movieId: req.params.id,
      ...req.body,
    };

    await this.movieService.updateRate(rating);

    res.status(204).end();
  };

  findWithActors = async (req: ParsedRequest<FindMovieByIdReq>, res: Response) => {
    const movie = await this.movieService.findWithActors(req.params.id);

    res.status(200).json({
      movie,
    });
  };

  rateActor = async (req: ParsedRequest<RateActorReq>, res: Response): Promise<void> => {
    const rating = {
      ...req.params,
      ...req.body,
    };

    const rateInfo = await this.movieService.rateActor(rating);

    res.status(201).json({
      rateInfo,
    });
  };

  addActors = async (req: ParsedRequest<AddActorMovieReq>, res: Response) => {
    const movieActors = await this.movieService.addActors(req.params.id, req.body.actorIds);

    res.status(201).json({
      movieActors,
    });
  };
}
