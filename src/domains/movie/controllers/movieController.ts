import { Response } from 'express';
import { inject, injectable } from 'inversify';
import { ParsedRequest } from '../../../apiTypes';
import { CreateMovieReq } from '../schemas/createMovieValidationSchema';
import { FindMovieByIdReq } from '../schemas/findMovieByIdValidationSchema';
import { TYPES } from '../../../ioc/types/types';
import { IMovieService } from '../services/movieService';
import { FindMovieByCriteriaReq } from '../schemas/findMovieByCriteriaValidationSchema';
import { RateMovieReq } from '../schemas/rateMovieValidationSchema';
import { AddActorMovieReq } from '../schemas/addActorsToMovieValidationSchema';

export interface IMovieController {
  findById(req: ParsedRequest<FindMovieByIdReq>, res: Response): Promise<void>;
  findByCriteria(req: ParsedRequest<FindMovieByCriteriaReq>, res: Response): Promise<void>;
  create(req: ParsedRequest<CreateMovieReq>, res: Response): Promise<void>;

  rate(req: ParsedRequest<RateMovieReq>, res: Response): Promise<void>;
  updateRate(req: ParsedRequest<RateMovieReq>, res: Response): Promise<void>;

  addActorsToMovie(req: ParsedRequest<AddActorMovieReq>, res: Response): Promise<void>;
}

@injectable()
export class MovieController implements IMovieController {
  constructor(
    @inject(TYPES.MovieServiceToken)
    private readonly movieService: IMovieService,
  ) {}

  create = async (req: ParsedRequest<CreateMovieReq>, res: Response): Promise<void> => {
    const movie = await this.movieService.create(req.body);

    res.status(201).json({
      movie,
    });
  };

  findById = async (req: ParsedRequest<FindMovieByIdReq>, res: Response): Promise<void> => {
    const extensionCriteria = {
      withRating: req.query.withRating === 'true',
      withActors: req.query.withActors === 'true',
    };

    const movie = await this.movieService.findById(req.params.id, extensionCriteria);

    res.status(200).json({
      movie,
    });
  };

  findByCriteria = async (req: ParsedRequest<FindMovieByCriteriaReq>, res: Response): Promise<void> => {
    const extensionCriteria = {
      withRating: req.query.withRating === 'true',
      withActors: req.query.withActors === 'true',
    };

    const movies = await this.movieService.findByCriteria(req.query, extensionCriteria);

    res.status(200).json({
      movies,
    });
  };

  rate = async (req: ParsedRequest<RateMovieReq>, res: Response): Promise<void> => {
    const rating = {
      movieId: req.params.id,
      rating: req.body.rating,
      userId: res.locals.user.id,
    };

    const ratingInfo = await this.movieService.rate(rating);

    res.status(201).json({
      ratingInfo,
    });
  };

  updateRate = async (req: ParsedRequest<RateMovieReq>, res: Response): Promise<void> => {
    const rating = {
      movieId: req.params.id,
      rating: req.body.rating,
      userId: res.locals.user.id,
    };

    await this.movieService.updateRate(rating);

    res.sendStatus(204);
  };

  addActorsToMovie = async (req: ParsedRequest<AddActorMovieReq>, res: Response) => {
    await this.movieService.addActorsToMovie(req.params.id, req.body.actorIds);

    res.sendStatus(204);
  };
}
