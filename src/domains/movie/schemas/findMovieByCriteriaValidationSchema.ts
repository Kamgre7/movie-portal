import { z } from 'zod';
import { CATEGORY } from '../types/categoryType';

export const FindMovieByCriteriaQuery = z.object({
  title: z.string().trim().min(1).optional(),
  category: z.nativeEnum(CATEGORY).optional(),
  releaseDate: z.coerce
    .date()
    .refine((val) => val < new Date())
    .optional(),
  withRating: z.string().optional(),
  withActors: z.string().optional(),
});

export const FindMovieByCriteriaSchema = z.object({
  query: FindMovieByCriteriaQuery,
});

export type FindMovieByCriteriaReq = z.infer<typeof FindMovieByCriteriaSchema>;

export type MovieCriteria = Omit<
  z.infer<typeof FindMovieByCriteriaQuery>,
  'withRating' | 'withActors'
>;

export type MovieExtensionCriteria = {
  withRating: boolean;
  withActors: boolean;
};
