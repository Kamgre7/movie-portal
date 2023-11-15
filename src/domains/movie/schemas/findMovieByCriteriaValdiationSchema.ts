import { z } from 'zod';
import { CATEGORY } from '../types/categoryType';

export const FindMovieByCriteriaQuery = z.object({
  title: z.string().trim().min(1).optional(),
  category: z.nativeEnum(CATEGORY).optional(),
  releaseDate: z.coerce
    .date()
    .refine((val) => val < new Date())
    .optional(),
  actors: z.array(z.string().uuid()).default([]),
});

export const FindMovieByCriteriaSchema = z.object({
  query: FindMovieByCriteriaQuery,
});

export type FindMovieByCriteriaReq = z.infer<typeof FindMovieByCriteriaSchema>;
export type MovieCriteria = z.infer<typeof FindMovieByCriteriaQuery>;
export type MovieCriteriaWithoutActors = Omit<MovieCriteria, 'actors'>;
