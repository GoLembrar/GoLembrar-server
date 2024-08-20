import { ApiProperty } from '@nestjs/swagger';
import { Channel } from '../dto/create-contact.dto';

export class GetContactResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  identify: string;

  @ApiProperty({ enum: Channel, enumName: 'Channel' })
  channel: Channel;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  favorite: boolean;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
}
