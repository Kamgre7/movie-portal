import { z } from 'zod';
import { passwordRegex } from '../../user/schemas/createUserValidationSchema';

export const LoginBodySchema = z.object({
  email: z.string().email(),
  password: z.string().regex(passwordRegex),
});

export const LoginSchema = z.object({
  body: LoginBodySchema,
});

export type LoginReq = z.infer<typeof LoginSchema>;
export type LoginData = z.infer<typeof LoginBodySchema>;
