import { ApiProperty } from '@nestjs/swagger';
import { Channel } from '@prisma/client';
import { IsNotEmpty, IsString, Max, Min } from 'class-validator';

export class CreateContactDto {
  @IsNotEmpty()
  @IsString()
  @Min(3)
  @Max(100)
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
