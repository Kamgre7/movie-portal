import { z } from 'zod';

export const FindActorByIdParamSchema = z.object({
  id: z.string().uuid(),
});

export const FindActorByIdSchema = z.object({
  params: FindActorByIdParamSchema,
  query: z.object({
    withRating: z.string().optional(),
  }),
});

export type FindActorByIdReq = z.infer<typeof FindActorByIdSchema>;

export const FindActorByCriteriaQuery = z.object({
  firstName: z.string().trim().min(1).optional(),
  lastName: z.string().trim().min(1).optional(),
  withRating: z.string().optional(),
});

export const FindActorByCriteria = z.object({
  query: FindActorByCriteriaQuery,
});

export type FindActorByCriteriaReq = z.infer<typeof FindActorByCriteria>;
export type ActorCriteria = Omit<z.infer<typeof FindActorByCriteriaQuery>, 'withRating'>;
