import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty()
  @ApiProperty({ example: 'Category name' })
  name: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ example: 1 })
  usersId: number;
}
