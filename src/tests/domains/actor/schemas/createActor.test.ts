import { CreateActorSchema } from '../../../../domains/actor/schemas/createActorValidationSchema';
import { GENDER } from '../../../../domains/user/types/genderType';

describe('Create actor validation schema', () => {
  let body: {
    firstName: unknown;
    lastName: unknown;
    gender: unknown;
  };

  let createActorData: {
    body: typeof body;
  };

  beforeEach(() => {
    body = {
      firstName: 'John',
      lastName: 'Smith',
      gender: GENDER.MALE,
    };

    createActorData = {
      body,
    };
  });

  it('Should return true when firstName is string, lastName is string, and gender is MALE or FEMALE', () => {
    const { success } = CreateActorSchema.safeParse(createActorData);

    expect(success).toBe(true);
  });

  it('Should return false when firstName or lastName is not string', () => {
    body.lastName = null;
    const { success } = CreateActorSchema.safeParse(createActorData);

    expect(success).toBe(false);
  });

  it('Should return false if firstName or lastName is shorter than 3 characters', () => {
    body.firstName = 'Te';

    const { success } = CreateActorSchema.safeParse(createActorData);

    expect(success).toBe(false);
  });

  it('Should return false if gender is not male or female', () => {
    body.gender = 1;

    const { success } = CreateActorSchema.safeParse(createActorData);

    expect(success).toBe(false);
  });
});
