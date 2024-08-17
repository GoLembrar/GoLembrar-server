import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';
import { passwordDecoratorOptions } from './utils/password';

export class UpdateUserPasswordDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  @ApiProperty({ example: 'Senha atual', required: false })
  password: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  @IsStrongPassword(passwordDecoratorOptions)
  @ApiProperty({ example: 'Nova senha' })
  newPassword: string;
}
