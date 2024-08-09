import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  Max,
  Min,
} from 'class-validator';
import { passwordDecoratorOptions } from './utils/password';

export class UpdateUserPasswordDto {
  @IsNotEmpty()
  @IsString()
  @Min(6)
  @Max(20)
  @ApiProperty({ example: 'Senha atual', required: false })
  password: string;

  @IsNotEmpty()
  @IsString()
  @Min(6)
  @Max(20)
  @IsStrongPassword(passwordDecoratorOptions)
  @ApiProperty({ example: 'Nova senha' })
  newPassword: string;
}
