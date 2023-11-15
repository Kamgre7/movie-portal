export const CATEGORY = {
  ACTION: 'action',
  COMEDY: 'comedy',
  DRAMA: 'drama',
  FANTASY: 'fantasy',
  THRILLER: 'thriller',
} as const;

export type CategoryType = (typeof CATEGORY)[keyof typeof CATEGORY];
