import { Response } from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../../ioc/types/types';
import { ParsedRequest } from '../../../apiTypes';
import { FindActorByIdReq } from '../schemas/findActorSchema';
import { CreateActorReq } from '../schemas/createActorSchema';
import { IActorService } from '../services/actorService';

export interface IActorController {
  findById(req: ParsedRequest<FindActorByIdReq>, res: Response): Promise<void>;
  create(req: ParsedRequest<CreateActorReq>, res: Response): Promise<void>;
}

@injectable()
export class ActorController implements IActorController {
  constructor(
    @inject(TYPES.ActorServiceToken)
    private readonly actorService: IActorService
  ) {}

  findById = async (
    req: ParsedRequest<FindActorByIdReq>,
    res: Response
  ): Promise<void> => {
    const actor = await this.actorService.findById(req.params.id);

    res.status(200).json({
      actor,
    });
  };

  create = async (
    req: ParsedRequest<CreateActorReq>,
    res: Response
  ): Promise<void> => {
    const { body } = req;

    const actor = await this.actorService.create(body);

    res.status(201).json({
      actor,
    });
  };
}
