import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsMobilePhone,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { passwordDecoratorOptions } from './utils/password';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @IsStrongPassword(passwordDecoratorOptions)
  @ApiProperty({ example: '123456' })
  password: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @ApiProperty({ example: 'user@email.com' })
  email: string;

  @IsNotEmpty()
  @IsString()
  @IsMobilePhone('pt-BR')
  @ApiProperty({ example: '999999999' })
  phone: string;

  @IsNotEmpty()
  name: string;
}
