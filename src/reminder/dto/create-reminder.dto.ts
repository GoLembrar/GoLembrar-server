import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class CreateReminderDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  title: string;
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  description: string;
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  platform: string;
  @IsNotEmpty()
  @IsDateString()
  @ApiProperty()
  scheduled: Date;
  @IsNotEmpty()
  @IsInt()
  @ApiProperty()
  ownerId: number;
}
