import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestWithUser } from '../utils/types/RequestWithUser';

export const AddRequestUserId = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request: RequestWithUser = context.switchToHttp().getRequest();
    const userId = request.user.id;

    // Adicione o userId ao objeto request
    request.body.userId = userId;

    return data;
  },
);
