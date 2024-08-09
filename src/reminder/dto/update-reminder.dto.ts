import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class UpdateReminderDto {
  @IsOptional()
  @IsString()
  @Min(2)
  @Max(120)
  @ApiProperty({ example: 'Reminder title', required: false })
  title?: string;

  @IsOptional()
  @IsString()
  @Min(2)
  @Max(500)
  @ApiProperty({ example: 'Reminder description', required: false })
  description?: string;

  @IsOptional()
  @IsDateString()
  @ApiProperty({ example: '2021-09-01T00:00:00.000Z', required: false })
  scheduled?: Date;

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  @ApiProperty({
    example: ['59c3ff44-cc76-4dbd-9631-cdf5da44ae76'],
    required: false,
  })
  usersToReminder?: string[];

  @IsOptional()
  @IsUUID()
  @ApiProperty({
    example: '7eebe2b6-5877-459c-ae65-a7e9383624e6',
    required: false,
  })
  ownerId?: string;
}
