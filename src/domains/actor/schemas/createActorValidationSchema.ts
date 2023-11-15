import { z } from 'zod';
import { GENDER } from '../../user/types/genderType';

export const CreateActorBodySchema = z.object({
  firstName: z.string().min(3),
  lastName: z.string().min(3),
  gender: z.nativeEnum(GENDER),
});

export const CreateActorSchema = z.object({
  body: CreateActorBodySchema,
});

export type CreateActorReq = z.infer<typeof CreateActorSchema>;
export type NewActor = z.infer<typeof CreateActorBodySchema>;
