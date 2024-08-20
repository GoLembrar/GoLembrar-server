import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

export function CreatedResponse(description?: string, message?: string) {
  return applyDecorators(
    ApiResponse({
      status: 201,
      description,
      content: {
        'application/json': {
          example: {
            message,
          },
        },
      },
    }),
  );
}
