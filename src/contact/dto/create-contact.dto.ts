import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export enum Channel {
  EMAIL = 'EMAIL',
  WHATSAPP = 'WHATSAPP',
  TELEGRAM = 'TELEGRAM',
  DISCORD = 'DISCORD',
}

export class CreateContactDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  @ApiProperty({ example: 'Foo Name' })
  name: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @ApiProperty({ example: 'email@email.com' })
  identify: string;

  @IsNotEmpty()
  @IsEnum(Channel)
  @ApiProperty({ example: 'EMAIL' })
  channel: Channel;

  userId: string;
}
