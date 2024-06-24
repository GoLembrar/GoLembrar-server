import { IsStrongPasswordOptions } from 'class-validator';

export const passwordDecoratorOptions: IsStrongPasswordOptions = {
  minLength: 6,
  minNumbers: 0,
  minSymbols: 0,
  minUppercase: 1,
};
