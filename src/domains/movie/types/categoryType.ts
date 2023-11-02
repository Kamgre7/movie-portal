export const CATEGORY = {
  ACTION: 'action',
  COMEDY: 'comedy',
  DRAMA: 'drama',
  FANTASY: 'Fantasy',
  THRILLER: 'thriller',
} as const;

export type CategoryType = (typeof CATEGORY)[keyof typeof CATEGORY];
