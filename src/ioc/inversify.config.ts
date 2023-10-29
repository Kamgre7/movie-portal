import { Container } from 'inversify';
import {
  IPasswordManager,
  PasswordManager,
} from '../domains/passwordManager/passwordManager';
import { TYPES } from './types/types';

export const container = new Container();

container
  .bind<IPasswordManager>(TYPES.PasswordManagerToken)
  .to(PasswordManager);
