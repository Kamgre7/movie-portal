import { z } from 'zod';

export const RefreshTokenBodySchema = z.object({
  refreshToken: z.string().min(1),
});

export const RefreshTokenSchema = z.object({
  body: RefreshTokenBodySchema,
});

export type RefreshTokenReq = z.infer<typeof RefreshTokenSchema>;
export type TokenData = z.infer<typeof RefreshTokenBodySchema>;
