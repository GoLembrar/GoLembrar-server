import { ApiProperty } from "@nestjs/swagger"

export class DefaultException {
    @ApiProperty()
    message: string
    @ApiProperty()
    error: string
    @ApiProperty({default: 401})
    statusCode: number
}