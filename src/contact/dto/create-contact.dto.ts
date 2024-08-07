import { Channel } from '@prisma/client';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateContactDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  identify: string;

  @IsNotEmpty()
  @IsString()
  channel: Channel;

  userId: string;
}
