import { ApiProperty } from '@nestjs/swagger';

export class ForbiddenException {
  @ApiProperty()
  message: string;

  @ApiProperty({ default: 'forbidden' })
  error: string;

  @ApiProperty({ default: 403 })
  statusCode: number;
}
