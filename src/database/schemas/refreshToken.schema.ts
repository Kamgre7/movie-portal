export interface RefreshTokensTable {
  userId: string;
  token: string | null;
  expireAt: Date | null;
  createdAt: Date | null;
}
