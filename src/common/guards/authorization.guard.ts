import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    const authorizationHeader: string = request.headers.authorization;
    if (!authorizationHeader)
      throw new UnauthorizedException('Sem autorização na requisição');

    const token: string = authorizationHeader.split('Bearer ')[1];
    const decoded = this.jwt.verify(token);
    if (decoded) {
      request['user'] = decoded;
      return !!decoded;
    }
  }
}
