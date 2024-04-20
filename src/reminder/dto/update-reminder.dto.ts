import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateReminderDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Reminder title', required: false })
  title?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Reminder description', required: false })
  description?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Reminder platform', required: false })
  platform?: string;

  @IsOptional()
  @IsDateString()
  @ApiProperty({ example: '2021-09-01T00:00:00.000Z', required: false })
  scheduled?: Date;

  @IsOptional()
  @IsInt()
  @ApiProperty({ example: 1, required: false })
  categoryId?: number;
}
