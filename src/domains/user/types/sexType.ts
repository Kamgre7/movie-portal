export const SEX = {
  MALE: 'male',
  FEMALE: 'female',
} as const;

export type SexType = (typeof SEX)[keyof typeof SEX];
