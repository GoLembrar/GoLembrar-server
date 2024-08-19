import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

export function NoContentResponse(description?: string) {
  return applyDecorators(
    ApiResponse({
      status: 204,
      description,
    }),
  );
}
