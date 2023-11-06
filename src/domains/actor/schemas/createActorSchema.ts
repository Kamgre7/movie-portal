import { z } from 'zod';
import { SEX } from '../../user/types/sexType';

export const CreateActorBodySchema = z.object({
  firstName: z.string().min(3),
  lastName: z.string().min(3),
  gender: z.enum([SEX.MALE, SEX.FEMALE]),
});

export const CreateActorSchema = z.object({
  body: CreateActorBodySchema,
});

export type CreateActorReq = z.infer<typeof CreateActorSchema>;
export type NewActor = z.infer<typeof CreateActorBodySchema>;
