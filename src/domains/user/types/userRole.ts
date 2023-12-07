export const ROLE = {
  USER: 'user',
  ADMIN: 'admin',
} as const;

export type RoleType = (typeof ROLE)[keyof typeof ROLE];
