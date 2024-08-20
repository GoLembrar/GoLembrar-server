import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { UnprocessableEntityException } from '../../common/utils/exception/unprocessable-entity.exception';

export function UnprocessableEntityResponse() {
  return applyDecorators(
    ApiResponse({
      status: 422,
      description: 'Unprocessable entity error response',
      type: UnprocessableEntityException,
    }),
  );
}
