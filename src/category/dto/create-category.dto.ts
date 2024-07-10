import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty()
  @ApiProperty({ example: 'Category name' })
  name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'abc....' })
  usersId: string;
}
