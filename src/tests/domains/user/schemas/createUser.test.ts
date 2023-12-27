import { CreateUserSchema } from '../../../../domains/user/schemas/createUserValidationSchema';
import { GENDER } from '../../../../domains/user/types/genderType';

describe('Create user validation schema', () => {
  let body: {
    email: unknown;
    firstName: unknown;
    lastName: unknown;
    password: unknown;
    gender: unknown;
  };

  let createUserData: {
    body: typeof body;
  };

  beforeEach(() => {
    body = {
      firstName: 'John',
      lastName: 'Smith',
      email: 'john@gmail.com',
      password: 'abCD&1234',
      gender: GENDER.MALE,
    };

    createUserData = {
      body,
    };
  });

  //Password - minimum eight characters, at least one uppercase, one lowercase character, one number and one special character

  it('Should return true when firstName, lastName, password are string, gender is value of GENDER enum', () => {
    const { success } = CreateUserSchema.safeParse(createUserData);

    expect(success).toBe(true);
  });

  it('Should return false when email is not email type string', () => {
    body.email = 'emailAddress';
    const { success } = CreateUserSchema.safeParse(createUserData);

    expect(success).toBe(false);
  });

  it('Should return false when password is shorter than 8 chars', () => {
    body.password = '123ASD&';
    const { success } = CreateUserSchema.safeParse(createUserData);

    expect(success).toBe(false);
  });

  it('Should return false when password has not special char', () => {
    body.password = '123ASDazx';
    const { success } = CreateUserSchema.safeParse(createUserData);

    expect(success).toBe(false);
  });

  it('Should return false when password has not lowercase char', () => {
    body.password = '123ASD&ASDSA';
    const { success } = CreateUserSchema.safeParse(createUserData);

    expect(success).toBe(false);
  });

  it('Should return false when firstName or lastName is not string', () => {
    body.lastName = null;
    const { success } = CreateUserSchema.safeParse(createUserData);

    expect(success).toBe(false);
  });

  it('Should return false if firstName or lastName is shorter than 3 characters', () => {
    body.firstName = 'Te';

    const { success } = CreateUserSchema.safeParse(createUserData);

    expect(success).toBe(false);
  });

  it('Should return false if gender is not male or female', () => {
    body.gender = 1;

    const { success } = CreateUserSchema.safeParse(createUserData);

    expect(success).toBe(false);
  });
});
