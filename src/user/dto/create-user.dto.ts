import {
  IsEmail,
  IsStrongPassword,
  IsStrongPasswordOptions,
} from 'class-validator';

const passwordDecoratorOptions: IsStrongPasswordOptions = {
  minLength: 6,
  minUppercase: 1,
};

export class CreateUserDto {
  @IsStrongPassword(passwordDecoratorOptions) password: string;
  @IsEmail() email: string;
}
