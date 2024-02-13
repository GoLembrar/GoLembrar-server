import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { ForbiddenException } from '../../common/utils/exception/forbidden.exception';

export function ForbiddenResponse() {
  return applyDecorators(
    ApiResponse({
      status: 403,
      description: 'forbidden',
      type: ForbiddenException,
    }),
  );
}
