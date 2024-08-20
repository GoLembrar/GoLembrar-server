import { ApiProperty } from '@nestjs/swagger';

export class NotFoundException {
  @ApiProperty()
  message: string;

  @ApiProperty({ default: 'Not found' })
  error: string;

  @ApiProperty({ default: 404 })
  statusCode: number;
}
