import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';
import { passwordDecoratorOptions } from './utils/password';

export class UpdateUserPasswordDto {
  @ApiProperty({ example: 'Senha atual', required: false })
  @IsString()
  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @IsString()
  @IsStrongPassword(passwordDecoratorOptions)
  @ApiProperty({ example: 'Nova senha' })
  newPassword: string;
}
