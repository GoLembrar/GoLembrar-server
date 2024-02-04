import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

export function CreatedResponse(body?: any) {
  return applyDecorators(
    ApiResponse({
      status: 201,
      description: 'created',
      type: body,
    }),
  );
}
