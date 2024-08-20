import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { BadRequestException } from '../../common/utils/exception/bad-request.exception';

export function BadRequestResponse() {
  return applyDecorators(
    ApiResponse({
      status: 400,
      description: 'Bad request error response',
      type: BadRequestException,
    }),
  );
}
