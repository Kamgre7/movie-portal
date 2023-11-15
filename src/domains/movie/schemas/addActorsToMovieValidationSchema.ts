import { z } from 'zod';

export const AddActorToMovieSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    actorIds: z.array(z.string().uuid()),
  }),
});

export type AddActorMovieReq = z.infer<typeof AddActorToMovieSchema>;
