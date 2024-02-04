import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

export function CreateCategoryResponse() {
  return applyDecorators(
    ApiResponse({
      status: 201,
      description: 'category created',
    }),
  );
}
