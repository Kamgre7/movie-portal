import { v4 as uuid } from 'uuid';
import { AddActorToMovieSchema } from '../../../../domains/movie/schemas/addActorsToMovieValidationSchema';

describe('Rate movie validation schema', () => {
  let params: {
    id: unknown;
  };

  let body: {
    actorIds: unknown;
  };

  let addActorsToMovieData: {
    params: typeof params;
    body: typeof body;
  };

  beforeEach(() => {
    body = {
      actorIds: [uuid(), uuid()],
    };

    params = {
      id: uuid(),
    };

    addActorsToMovieData = {
      body,
      params,
    };
  });

  it('Should return true when id is uuid, and actorIds is array of ids (uuid)', () => {
    const { success } = AddActorToMovieSchema.safeParse(addActorsToMovieData);

    expect(success).toBe(true);
  });

  it('Should return false when id is not uuid', () => {
    params.id = '1234';

    const { success } = AddActorToMovieSchema.safeParse(addActorsToMovieData);

    expect(success).toBe(false);
  });

  it('Should return false when rating is not an array of ids', () => {
    body.actorIds = [10, 2];

    const { success } = AddActorToMovieSchema.safeParse(addActorsToMovieData);

    expect(success).toBe(false);
  });
});
