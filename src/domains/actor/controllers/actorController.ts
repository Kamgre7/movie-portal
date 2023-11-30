import { Response } from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../../ioc/types/types';
import { ParsedRequest } from '../../../apiTypes';
import { FindActorByCriteriaReq, FindActorByIdReq } from '../schemas/findActorValidationSchema';
import { CreateActorReq } from '../schemas/createActorValidationSchema';
import { IActorService } from '../services/actorService';
import { RateActorReq } from '../schemas/rateActorValidationSchema';

export interface IActorController {
  findById(req: ParsedRequest<FindActorByIdReq>, res: Response): Promise<void>;
  findByCriteria(req: ParsedRequest<FindActorByCriteriaReq>, res: Response): Promise<void>;
  create(req: ParsedRequest<CreateActorReq>, res: Response): Promise<void>;

  rate(req: ParsedRequest<RateActorReq>, res: Response): Promise<void>;
  updateRate(req: ParsedRequest<RateActorReq>, res: Response): Promise<void>;
}

@injectable()
export class ActorController implements IActorController {
  constructor(
    @inject(TYPES.ActorServiceToken)
    private readonly actorService: IActorService
  ) {}

  findById = async (req: ParsedRequest<FindActorByIdReq>, res: Response): Promise<void> => {
    const withRating = req.query.withRating === 'true';

    const actor = await this.actorService.findById(req.params.id, withRating);

    res.status(200).json({
      actor,
    });
  };

  findByCriteria = async (
    req: ParsedRequest<FindActorByCriteriaReq>,
    res: Response
  ): Promise<void> => {
    const { withRating, firstName, lastName } = req.query;

    const actors = await this.actorService.findByCriteria(
      { firstName, lastName },
      withRating === 'true'
    );

    res.status(200).json({
      actors,
    });
  };

  create = async (req: ParsedRequest<CreateActorReq>, res: Response): Promise<void> => {
    const { body } = req;

    const actor = await this.actorService.create(body);

    res.status(201).json({
      actor,
    });
  };

  rate = async (req: ParsedRequest<RateActorReq>, res: Response): Promise<void> => {
    const rateInfo = {
      ...req.params,
      ...req.body,
    };

    const rating = await this.actorService.rate(rateInfo);

    res.status(201).json({
      rating,
    });
  };

  updateRate = async (req: ParsedRequest<RateActorReq>, res: Response): Promise<void> => {
    const rateInfo = {
      ...req.params,
      ...req.body,
    };

    await this.actorService.updateRate(rateInfo);

    res.status(204).end();
  };
}
