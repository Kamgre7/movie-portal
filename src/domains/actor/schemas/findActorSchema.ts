import { z } from 'zod';

export const FindActorByIdParamSchema = z.object({
  id: z.string().uuid(),
});

export const FindActorByIdSchema = z.object({
  params: FindActorByIdParamSchema,
});

export type FindActorByIdReq = z.infer<typeof FindActorByIdSchema>;
