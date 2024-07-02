import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { passwordDecoratorOptions } from './utils/password';

export class CreateUserDto {
  @IsNotEmpty()
  @ApiProperty({ example: 'Foo Name' })
  name: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @ApiProperty({ example: 'example@example.com' })
  email: string;

  @IsNotEmpty()
  @IsString()
  @IsStrongPassword(passwordDecoratorOptions)
  @ApiProperty({ example: 'secretPassword' })
  password: string;
}
