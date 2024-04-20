import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { NotFoundException } from '../../common/utils/exception/not-found.exception';

export function NotFoundResponse() {
  return applyDecorators(
    ApiResponse({
      status: 404,
      description: 'not found',
      type: NotFoundException,
    }),
  );
}
