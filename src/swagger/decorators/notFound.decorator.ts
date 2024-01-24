import { applyDecorators } from "@nestjs/common";
import { ApiResponse } from "@nestjs/swagger";

export function NotFoundResponse() {
    return applyDecorators(
        ApiResponse({
            status: 404,
            description: 'not found'
          }),
    );
}