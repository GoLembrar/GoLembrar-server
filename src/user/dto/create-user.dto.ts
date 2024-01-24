import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsMobilePhone,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  IsStrongPasswordOptions,
} from 'class-validator';

const passwordDecoratorOptions: IsStrongPasswordOptions = {
  minLength: 6,
  minNumbers: 0,
  minSymbols: 0,
  minUppercase: 1,
};
export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @IsStrongPassword(passwordDecoratorOptions)
  @ApiProperty({ example: '123456'})
  password: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @ApiProperty({ example: 'user@email.com'})
  email: string;

  @IsNotEmpty()
  @IsString()
  @IsMobilePhone('pt-BR')
  @ApiProperty({ example: '999999999'})
  phone: string;
}
