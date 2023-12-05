import { Request, Response } from 'express';
import { LoginReq } from '../schemas/loginValidationSchema';
import { ParsedRequest } from '../../../apiTypes';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../../ioc/types/types';
import { IAuthService } from '../services/authService';
import { RefreshTokenReq } from '../schemas/refreshTokenValidationSchema';

export interface IAuthController {
  login(req: ParsedRequest<LoginReq>, res: Response): Promise<void>;
  refreshToken(req: ParsedRequest<RefreshTokenReq>, res: Response): Promise<void>;
  logout(req: ParsedRequest<Request>, res: Response): Promise<void>;
}

@injectable()
export class AuthController implements IAuthController {
  constructor(
    @inject(TYPES.AuthServiceToken)
    private readonly authService: IAuthService
  ) {}

  login = async (req: ParsedRequest<LoginReq>, res: Response): Promise<void> => {
    const tokens = await this.authService.login(req.body);

    res.status(201).json({
      tokens,
    });
  };

  refreshToken = async (req: ParsedRequest<RefreshTokenReq>, res: Response): Promise<void> => {
    const token = await this.authService.refreshToken(req.body.refreshToken);

    res.status(201).json({ token });
  };

  logout = async (req: ParsedRequest<Request>, res: Response): Promise<void> => {
    const user = res.locals.user;

    await this.authService.logout(user.id);

    res.sendStatus(204);
  };
}
