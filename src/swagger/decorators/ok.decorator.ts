import { applyDecorators } from "@nestjs/common";
import { ApiResponse } from "@nestjs/swagger";

export function OkResponse(body: any) {
    return applyDecorators(
        ApiResponse({
            status: 200,
            description: 'unauthorized',
            type: body,
          }),
    );
}