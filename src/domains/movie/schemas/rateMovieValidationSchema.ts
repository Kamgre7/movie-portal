import { z } from 'zod';

export const RateMovieSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    rating: z.coerce.number().int().min(1).max(5),
  }),
});

export type RateMovieReq = z.infer<typeof RateMovieSchema>;
