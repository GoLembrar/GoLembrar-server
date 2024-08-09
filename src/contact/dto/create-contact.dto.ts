import { ApiProperty } from '@nestjs/swagger';
import { Channel } from '@prisma/client';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateContactDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  @ApiProperty({ example: 'Foo Name' })
  name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'email@email.com' })
  identify: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'EMAIL' })
  channel: Channel;

  userId: string;
}
