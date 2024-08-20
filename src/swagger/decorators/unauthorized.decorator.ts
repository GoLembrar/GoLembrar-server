import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { UnauthorizedException } from '../../common/utils/exception/unauthorized.exception';

export function UnauthorizedResponse() {
  return applyDecorators(
    ApiResponse({
      status: 401,
      description: 'Unauthorized error response',
      type: UnauthorizedException,
    }),
  );
}
