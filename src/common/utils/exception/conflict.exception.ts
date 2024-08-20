import { ApiProperty } from '@nestjs/swagger';

export class ConflictException {
  @ApiProperty({ default: 409 })
  statusCode: number;

  @ApiProperty({ default: 'Conflict' })
  error: string;

  @ApiProperty()
  message: string;
}
