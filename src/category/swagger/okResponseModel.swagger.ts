import { ApiProperty } from '@nestjs/swagger';

export class OkResponseModel {
  @ApiProperty()
  id: number;
  @ApiProperty()
  name: string;
}
