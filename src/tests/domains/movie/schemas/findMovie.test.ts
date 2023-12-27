import { v4 as uuid } from 'uuid';
import { CATEGORY } from '../../../../domains/movie/types/categoryType';
import { FindMovieByIdSchema } from '../../../../domains/movie/schemas/findMovieByIdValidationSchema';
import { FindMovieByCriteriaSchema } from '../../../../domains/movie/schemas/findMovieByCriteriaValidationSchema';

describe('Find movie validation schema', () => {
  let queryByCriteria: {
    title: unknown;
    category: unknown;
    releaseDate: unknown;
  };

  let findById: {
    params: {
      id: unknown;
    };
    query: {};
  };

  let findByCriteria: {
    query: typeof queryByCriteria;
  };

  beforeEach(() => {
    findById = {
      params: {
        id: uuid(),
      },
      query: {},
    };

    queryByCriteria = {
      title: 'Film',
      category: CATEGORY.ACTION,
      releaseDate: new Date('2014-05-05'),
    };

    findByCriteria = {
      query: queryByCriteria,
    };
  });

  describe('Find by id', () => {
    it('Should return true when id is uuid', () => {
      const { success } = FindMovieByIdSchema.safeParse(findById);

      expect(success).toBe(true);
    });

    it('Should return false when id is not uuid', () => {
      findById.params.id = 'abcd';

      const { success } = FindMovieByIdSchema.safeParse(findById);

      expect(success).toBe(false);
    });
  });

  describe('Find by criteria', () => {
    it('Should return true when title is string with min length 1, category is enum CATEGORY value, release date is < current date - optional params', () => {
      const { success } = FindMovieByCriteriaSchema.safeParse(findByCriteria);

      expect(success).toBe(true);
    });

    it('Should return false when title is not string', () => {
      findByCriteria.query.title = null;

      const { success } = FindMovieByCriteriaSchema.safeParse(findByCriteria);

      expect(success).toBe(false);
    });

    it('Should return false when category is not enum CATEGORY value', () => {
      findByCriteria.query.category = 'movie';

      const { success } = FindMovieByCriteriaSchema.safeParse(findByCriteria);

      expect(success).toBe(false);
    });

    it('Should return false when release date is > current date', () => {
      findByCriteria.query.releaseDate = new Date('2030-05-05');

      const { success } = FindMovieByCriteriaSchema.safeParse(findByCriteria);

      expect(success).toBe(false);
    });
  });
});
