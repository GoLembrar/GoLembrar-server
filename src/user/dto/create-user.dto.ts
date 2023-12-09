import {
  IsEmail,
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
  password: string;
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;
}
