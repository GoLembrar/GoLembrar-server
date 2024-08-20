import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { ConflictException } from '../../common/utils/exception/conflict.exception';

export function ConflictResponse() {
  return applyDecorators(
    ApiResponse({
      status: 409,
      description: 'Already exists error response',
      type: ConflictException,
    }),
  );
}
