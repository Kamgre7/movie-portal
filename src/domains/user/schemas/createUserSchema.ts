import { z } from 'zod';
import { SEX } from '../types/sexType';

// Minimum eight characters, at least one uppercase, one lowercase character, one number and one special character
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const CreateUserBodySchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(3),
  lastName: z.string().min(3),
  password: z.string().regex(passwordRegex),
  gender: z.enum([SEX.MALE, SEX.FEMALE]),
});

export const CreateUserSchema = z.object({
  body: CreateUserBodySchema,
});

export type CreateUserReq = z.infer<typeof CreateUserSchema>;
export type NewUser = z.infer<typeof CreateUserBodySchema>;
