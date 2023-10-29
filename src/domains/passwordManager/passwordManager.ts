import { compare, genSalt, hash } from 'bcrypt';
import { injectable } from 'inversify';

export interface IPasswordManager {
  generateSalt(): Promise<string>;
  hashPwd(pwd: string, salt: string): Promise<string>;
  checkPwd(plainPwd: string, hashPwd: string): Promise<boolean>;
}

@injectable()
export class PasswordManager implements IPasswordManager {
  constructor() {}

  async generateSalt(): Promise<string> {
    return genSalt();
  }

  async hashPwd(pwd: string, salt: string): Promise<string> {
    return hash(pwd, salt);
  }

  async checkPwd(plainPwd: string, hashPwd: string): Promise<boolean> {
    return compare(plainPwd, hashPwd);
  }
}
