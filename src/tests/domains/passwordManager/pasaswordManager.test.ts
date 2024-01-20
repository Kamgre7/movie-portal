import { IPasswordManager, PasswordManager } from '../../../domains/passwordManager/passwordManager';

describe('Password manager', () => {
  let passwordManager: IPasswordManager;
  let salt: string;
  let plainPwd: string;

  beforeAll(async () => {
    passwordManager = new PasswordManager();
  });

  beforeEach(async () => {
    salt = await passwordManager.generateSalt();
    plainPwd = '1234';
  });

  it('Should return true - plain password is the same as the hashed one', async () => {
    const hashedPassword = await passwordManager.hashPwd(plainPwd, salt);

    const isPwdCorrect = await passwordManager.checkPwd(plainPwd, hashedPassword);

    expect(isPwdCorrect).toBe(true);
  });

  it('Should return false - plain password is not the same as the hashed one', async () => {
    const hashedPassword = await passwordManager.hashPwd(plainPwd, salt);

    plainPwd = '4321';

    const isPwdCorrect = await passwordManager.checkPwd(plainPwd, hashedPassword);

    expect(isPwdCorrect).toBe(false);
  });
});
