import { inject, injectable } from 'inversify';
import { LoginData } from '../schemas/loginValidationSchema';
import { TYPES } from '../../../ioc/types/types';
import { IPasswordManager } from '../../passwordManager/passwordManager';
import { IUserRepository } from '../../user/repository/userRepository';
import { IJwtManager, TokenPair } from '../jwt/jwtManager';
import { UnauthorizedError } from '../../../errors/unauthorizedError';
import { IRefreshTokenRepository } from '../repository/refreshTokenRepository';
import { ForbiddenError } from '../../../errors/forbiddenError';

export interface IAuthService {
  login(loginInfo: LoginData): Promise<TokenPair>;
  refreshToken(refreshToken: string): Promise<string>;
  logout(userId: string): Promise<void>;
}

@injectable()
export class AuthService implements IAuthService {
  constructor(
    @inject(TYPES.PasswordManagerToken)
    private readonly passwordManager: IPasswordManager,
    @inject(TYPES.UserRepositoryToken)
    private readonly userRepository: IUserRepository,
    @inject(TYPES.JwtManagerToken)
    private readonly jwtManager: IJwtManager,
    @inject(TYPES.RefreshTokenRepositoryToken)
    private readonly refreshTokenRepository: IRefreshTokenRepository,
  ) {}

  async login(loginInfo: LoginData): Promise<TokenPair> {
    const { email, password } = loginInfo;

    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    const isPwdCorrect = await this.passwordManager.checkPwd(password, user.password);

    if (!isPwdCorrect) {
      throw new UnauthorizedError('Incorrect password');
    }

    const tokens = this.jwtManager.createToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    await this.createOrUpdateTokenInDb(tokens.refreshToken, user.id);

    return tokens;
  }

  async refreshToken(refreshToken: string): Promise<string> {
    const token = await this.refreshTokenRepository.find({ refreshToken });

    if (!token) {
      throw new ForbiddenError('Invalid refresh token');
    }

    const newAccessToken = this.jwtManager.refreshToken(refreshToken);

    return newAccessToken;
  }

  async logout(userId: string): Promise<void> {
    this.refreshTokenRepository.softDelete(userId);
  }

  private async createOrUpdateTokenInDb(refreshToken: string, userId: string): Promise<void> {
    const refreshTokenInDb = await this.refreshTokenRepository.find({ userId });

    refreshTokenInDb
      ? await this.refreshTokenRepository.update(refreshToken, userId)
      : await this.refreshTokenRepository.create(refreshToken, userId);
  }
}
