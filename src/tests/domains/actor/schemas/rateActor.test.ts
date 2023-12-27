import { v4 as uuid } from 'uuid';
import { RateActorSchema } from '../../../../domains/actor/schemas/rateActorValidationSchema';

describe('Rate actor validation schema', () => {
  let params: {
    actorId: unknown;
    movieId: unknown;
  };

  let body: {
    rating: unknown;
  };

  let rateActorData: {
    params: typeof params;
    body: typeof body;
  };

  beforeEach(() => {
    body = {
      rating: 3,
    };

    params = {
      actorId: uuid(),
      movieId: uuid(),
    };

    rateActorData = {
      body,
      params,
    };
  });

  it('Should return true when actorId, movieId are uuid, and rating is int number between 1 and 5', () => {
    const { success } = RateActorSchema.safeParse(rateActorData);

    expect(success).toBe(true);
  });

  it('Should return false when actorId is not uuid', () => {
    params.actorId = '1234';

    const { success } = RateActorSchema.safeParse(rateActorData);

    expect(success).toBe(false);
  });

  it('Should return false when movieId is not uuid', () => {
    params.movieId = '1234';

    const { success } = RateActorSchema.safeParse(rateActorData);

    expect(success).toBe(false);
  });

  it('Should return false when rating is not number between 1 and 5', () => {
    body.rating = 10;

    const { success } = RateActorSchema.safeParse(rateActorData);

    expect(success).toBe(false);
  });

  it('Should return false when rating is not int number', () => {
    body.rating = '3.2';

    const { success } = RateActorSchema.safeParse(rateActorData);

    expect(success).toBe(false);
  });
});
