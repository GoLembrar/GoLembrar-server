import { ApiProperty } from '@nestjs/swagger';

export class UnauthorizedException {
  @ApiProperty()
  message: string;

  @ApiProperty({ default: 'Unauthorized' })
  error: string;

  @ApiProperty({ default: 401 })
  statusCode: number;
}
