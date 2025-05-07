import { Request } from 'express';

export type AuthenticatedRequest = Request & {
  user: SupabaseJwtPayload;
};

export type SupabaseJwtPayload = {
  sub: string;
  email: string;
  role?: string;
  [key: string]: unknown;
};
