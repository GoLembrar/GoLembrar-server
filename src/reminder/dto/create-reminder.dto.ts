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
  @ApiProperty({ example: 'Reminder title' })
  title: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Reminder description' })
  description: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Reminder platform' })
  platform: string;

  @IsNotEmpty()
  @IsDateString()
  @ApiProperty({ example: '2021-09-01T00:00:00.000Z' })
  scheduled: Date;

  @IsNotEmpty()
  @IsInt()
  @ApiProperty({ example: 1 })
  ownerId: number;

  @IsNotEmpty()
  @IsInt()
  @ApiProperty({ example: 1 })
  categoryId: number;
}
