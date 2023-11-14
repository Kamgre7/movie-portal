export const GENDER = {
  MALE: 'male',
  FEMALE: 'female',
} as const;

export type GenderType = (typeof GENDER)[keyof typeof GENDER];
