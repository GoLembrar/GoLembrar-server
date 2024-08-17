import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';
import { passwordDecoratorOptions } from './utils/password';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  @ApiProperty({ example: 'Foo Name' })
  name: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @MaxLength(100)
  @ApiProperty({ example: 'example@example.com' })
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  @IsStrongPassword(passwordDecoratorOptions)
  @ApiProperty({ example: 'secretPassword' })
  password: string;
}
