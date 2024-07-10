import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
export class addUserToBodyGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    if (request['user']) {
      request.body['userId'] = request['user'].id;
      return true;
    }
    return false;
  }
}
