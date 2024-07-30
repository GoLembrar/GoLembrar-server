import { ApiProperty } from '@nestjs/swagger';

export class GetReminderResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  scheduled: string;

  @ApiProperty()
  isActivated: boolean;

  @ApiProperty()
  ownerId: number;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
}
