import { z } from 'zod';

export const jwtSchema = z.object({
  jwtTokenSecret: z.string().min(1),
  jwtRefreshTokenSecret: z.string().min(1),
  jwtTokenExpireInDays: z.coerce.number(),
  jwtRefreshTokenExpireInDays: z.coerce.number(),
});

export const jwtConfig = jwtSchema.parse({
  jwtTokenSecret: process.env.JWT_TOKEN_SECRET,
  jwtRefreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET,
  jwtTokenExpireInDays: process.env.JWT_TOKEN_EXPIRE_IN_DAYS,
  jwtRefreshTokenExpireInDays: process.env.JWT_REFRESH_TOKEN_EXPIRE_IN_DAYS,
});
