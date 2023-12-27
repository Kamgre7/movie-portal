import { CreateMovieSchema } from '../../../../domains/movie/schemas/createMovieValidationSchema';
import { CATEGORY } from '../../../../domains/movie/types/categoryType';

describe('Create movie validation schema', () => {
  let body: {
    title: unknown;
    category: unknown;
    releaseDate: unknown;
  };

  let createMovieData: {
    body: typeof body;
  };

  beforeEach(() => {
    body = {
      title: 'Film',
      category: CATEGORY.ACTION,
      releaseDate: new Date('2014-05-05'),
    };

    createMovieData = {
      body,
    };
  });

  it('Should return true when title is string min. length: 2, category is value of enum CATEGORY, and release date is < current date', () => {
    const { success } = CreateMovieSchema.safeParse(createMovieData);

    expect(success).toBe(true);
  });

  it('Should return false when title is shorter than 2 chars', () => {
    body.title = 'T';

    const { success } = CreateMovieSchema.safeParse(createMovieData);

    expect(success).toBe(false);
  });

  it('Should return false when category is not enum CATEGORY value ', () => {
    body.category = 'Test';

    const { success } = CreateMovieSchema.safeParse(createMovieData);

    expect(success).toBe(false);
  });

  it('Should return false when release date is > current date', () => {
    body.releaseDate = new Date('2030-05-05');

    const { success } = CreateMovieSchema.safeParse(createMovieData);

    expect(success).toBe(false);
  });
});
