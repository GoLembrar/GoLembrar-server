import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsInt, IsNotEmpty, IsString } from 'class-validator';

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
  @IsDateString()
  @ApiProperty({ example: '2021-09-01T00:00:00.000Z' })
  scheduled: Date;

  @IsNotEmpty()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'abc...' })
  ownerId: string;

  @IsNotEmpty()
  @IsInt()
  @ApiProperty({ example: 1 })
  categoryId: number;
}
