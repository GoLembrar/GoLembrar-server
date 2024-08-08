import { Request } from 'express';

export type RequestWithUser = Request & {
  user: { sub: string; refreshToken: string };
};
