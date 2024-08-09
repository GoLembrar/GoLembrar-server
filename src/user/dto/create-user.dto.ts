import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  Max,
  Min,
} from 'class-validator';
import { passwordDecoratorOptions } from './utils/password';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @Min(3)
  @Max(100)
  @ApiProperty({ example: 'Foo Name' })
  name: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @Max(100)
  @ApiProperty({ example: 'example@example.com' })
  email: string;

  @IsNotEmpty()
  @IsString()
  @Min(6)
  @Max(20)
  @IsStrongPassword(passwordDecoratorOptions)
  @ApiProperty({ example: 'secretPassword' })
  password: string;
}
