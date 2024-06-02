import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty
} from 'class-validator';

/* const passwordDecoratorOptions: IsStrongPasswordOptions = {
  minLength: 6,
  minNumbers: 0,
  minSymbols: 0,
  minUppercase: 1,
}; */

export class CredentialsDto {
  @ApiProperty({ example: 'user@email.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '123456' })
  @IsNotEmpty()
  password: string;
}
