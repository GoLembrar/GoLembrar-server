import { applyDecorators, HttpStatus, Type } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

export function OkResponse(
  description: string,
  body?: Type<unknown> | [Type<unknown>],
) {
  return applyDecorators(
    ApiResponse({
      status: 200,
      description,
      type: body,
    }),
  );
}

export function OkHealthResponse(
  description: string,
  example: Record<string, unknown>,
) {
  return applyDecorators(
    ApiResponse({
      status: HttpStatus.OK,
      description,
      schema: {
        example,
      },
    }),
  );
}
