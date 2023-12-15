import { z } from 'zod';

export const AddMovieToWatchListSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    movieId: z.string().uuid(),
  }),
});

export type AddMovieToWatchListReq = z.infer<typeof AddMovieToWatchListSchema>;

export const GetMovieWatchListSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

export type GetMovieWatchListReq = z.infer<typeof GetMovieWatchListSchema>;
