import { v4 as uuid } from 'uuid';
import { RateMovieSchema } from '../../../../domains/movie/schemas/rateMovieValidationSchema';

describe('Rate movie validation schema', () => {
  let params: {
    id: unknown;
  };

  let body: {
    rating: unknown;
  };

  let rateMovieData: {
    params: typeof params;
    body: typeof body;
  };

  beforeEach(() => {
    body = {
      rating: 3,
    };

    params = {
      id: uuid(),
    };

    rateMovieData = {
      body,
      params,
    };
  });

  it('Should return true when id is uuid, and rating is int number between 1 and 5', () => {
    const { success } = RateMovieSchema.safeParse(rateMovieData);

    expect(success).toBe(true);
  });

  it('Should return false when id is not uuid', () => {
    params.id = '1234';

    const { success } = RateMovieSchema.safeParse(rateMovieData);

    expect(success).toBe(false);
  });

  it('Should return false when rating is not number between 1 and 5', () => {
    body.rating = 10;

    const { success } = RateMovieSchema.safeParse(rateMovieData);

    expect(success).toBe(false);
  });

  it('Should return false when rating is not int number', () => {
    body.rating = '3.2';

    const { success } = RateMovieSchema.safeParse(rateMovieData);

    expect(success).toBe(false);
  });
});
