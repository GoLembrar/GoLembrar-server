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
  @ApiProperty()
  password: string;
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @ApiProperty()
  email: string;
  @IsNotEmpty()
  @IsString()
  @IsMobilePhone('pt-BR')
  @ApiProperty()
  phone: string;
}
