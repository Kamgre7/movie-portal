import { inject, injectable } from 'inversify';
import { LoginData } from '../schemas/loginValidationSchema';
import { TYPES } from '../../../ioc/types/types';
import { IPasswordManager } from '../../passwordManager/passwordManager';
import { IUserRepository } from '../../user/repository/userRepository';
import { IJwtManager, TokenPair } from '../jwt/jwtManager';
import { UnauthorizedError } from '../../../errors/unauthorizedError';
import { IRefreshTokenRepository } from '../repository/refreshTokenRepository';

export interface IAuthService {
  login(loginInfo: LoginData): Promise<TokenPair>;
  refreshToken(refreshToken: string): Promise<void>;
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
    private readonly refreshTokenRepository: IRefreshTokenRepository
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
      role: 'USER',
    });

    await this.refreshTokenRepository.create(user.id, tokens.refreshToken);

    return tokens;
  }

  async refreshToken(refreshToken: string): Promise<void> {
    // @TODO
    // check if refresh token exist in db
    // if not exist throw Error with code 403
    //const newAccessToken = this.jwtManager.refreshToken(refreshToken);
  }
}
