import { z } from 'zod';

export const FindUserByIdParamSchema = z.object({
  id: z.string().uuid(),
});

export const FindUserByIdSchema = z.object({
  params: FindUserByIdParamSchema,
});

export type FindUserByIdReq = z.infer<typeof FindUserByIdSchema>;
