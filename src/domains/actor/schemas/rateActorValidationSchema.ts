import { z } from 'zod';

export const RateActorSchema = z.object({
  params: z.object({
    actorId: z.string().uuid(),
    movieId: z.string().uuid(),
  }),
  body: z.object({
    userId: z.string().uuid(),
    rating: z.coerce.number().int().min(1).max(5),
  }),
});

export type RateActorReq = z.infer<typeof RateActorSchema>;
