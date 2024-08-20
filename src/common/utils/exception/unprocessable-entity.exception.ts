import { ApiProperty } from '@nestjs/swagger';

export class UnprocessableEntityException {
  @ApiProperty()
  message: string;

  @ApiProperty({ default: 'Unprocessable Entity' })
  error: string;

  @ApiProperty({ default: 422 })
  statusCode: number;
}
