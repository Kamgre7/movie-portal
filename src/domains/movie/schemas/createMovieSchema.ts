import { z } from 'zod';
import { CATEGORY } from '../types/categoryType';

export const CreateMovieBodySchema = z.object({
  title: z.string().min(2),
  category: z.enum([
    CATEGORY.ACTION,
    CATEGORY.COMEDY,
    CATEGORY.DRAMA,
    CATEGORY.FANTASY,
    CATEGORY.THRILLER,
  ]),
  releaseDate: z.coerce.date(),
});

export const CreateMovieSchema = z.object({
  body: CreateMovieBodySchema,
});

export type CreateMovieReq = z.infer<typeof CreateMovieSchema>;
export type NewMovie = z.infer<typeof CreateMovieBodySchema>;