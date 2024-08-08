import { JwtPayload } from './jwt-payload.interface';

export interface JwtStrategy extends Partial<JwtPayload> {
  iat: number;
  email: string;
  exp: number;
}
