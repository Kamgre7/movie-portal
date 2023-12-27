import { v4 as uuid } from 'uuid';
import {
  FindActorByCriteria,
  FindActorByIdSchema,
} from '../../../../domains/actor/schemas/findActorValidationSchema';

describe('Find actor validation schema', () => {
  let queryByCriteria: {
    firstName: unknown;
    lastName: unknown;
    withRating: unknown;
  };

  let findById: {
    params: {
      id: unknown;
    };
    query: {
      withRating: unknown;
    };
  };

  let findByCriteria: {
    query: typeof queryByCriteria;
  };

  beforeEach(() => {
    findById = {
      params: {
        id: uuid(),
      },
      query: {
        withRating: 'false',
      },
    };

    queryByCriteria = {
      firstName: 'John',
      lastName: 'Smith',
      withRating: 'false',
    };

    findByCriteria = {
      query: queryByCriteria,
    };
  });

  describe('Find by id', () => {
    it('Should return true when id is uuid', () => {
      const { success } = FindActorByIdSchema.safeParse(findById);

      expect(success).toBe(true);
    });

    it('Should return false when id is not uuid', () => {
      findById.params.id = '10e';

      const { success } = FindActorByIdSchema.safeParse(findById);

      expect(success).toBe(false);
    });
  });

  describe('Find by criteria', () => {
    it('Should return true when firstName/lastName is string with min length 1 - optional params', () => {
      const { success } = FindActorByCriteria.safeParse(findByCriteria);

      expect(success).toBe(true);
    });

    it('Should return false when firstName or lastName is not string', () => {
      findByCriteria.query.firstName = null;

      const { success } = FindActorByCriteria.safeParse(findByCriteria);

      expect(success).toBe(false);
    });
  });
});
