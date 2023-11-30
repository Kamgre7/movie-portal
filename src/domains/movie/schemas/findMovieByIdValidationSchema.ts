import { z } from 'zod';

export const FindMovieByIdParamSchema = z.object({
  id: z.string().uuid(),
});

export const FindMovieQuerySchema = z.object({
  withRating: z.string().optional(),
  withActors: z.string().optional(),
});

export const FindMovieByIdSchema = z.object({
  params: FindMovieByIdParamSchema,
  query: FindMovieQuerySchema,
});

export type FindMovieByIdReq = z.infer<typeof FindMovieByIdSchema>;
