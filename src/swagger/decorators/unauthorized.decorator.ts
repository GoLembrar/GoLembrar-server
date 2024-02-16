import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { DefaultException } from '../../common/utils/exception/default.exception';

export function UnauthorizedResponse() {
  return applyDecorators(
    ApiResponse({
      status: 401,
      description: 'unauthorized',
      type: DefaultException,
    }),
  );
}
