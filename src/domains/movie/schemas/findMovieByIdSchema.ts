import { z } from 'zod';

export const FindMovieByIdParamSchema = z.object({
  id: z.string().uuid(),
});

export const FindMovieByIdSchema = z.object({
  params: FindMovieByIdParamSchema,
});

export type FindUserByIdReq = z.infer<typeof FindMovieByIdSchema>;
