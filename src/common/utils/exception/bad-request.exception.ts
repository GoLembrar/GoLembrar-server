import { ApiProperty } from '@nestjs/swagger';

export class BadRequestException {
  @ApiProperty()
  message: [string];

  @ApiProperty({ default: 'Bad Request' })
  error: string;

  @ApiProperty({ default: 400 })
  statusCode: number;
}
