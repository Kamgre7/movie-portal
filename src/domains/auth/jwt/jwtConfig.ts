import { z } from 'zod';

export const jwtSchema = z.object({
  jwtTokenSecret: z.string().min(1),
  jwtRefreshTokenSecret: z.string().min(1),
});

export const jwtConfig = jwtSchema.parse({
  jwtTokenSecret: process.env.JWT_TOKEN_SECRET,
  jwtRefreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET,
});
