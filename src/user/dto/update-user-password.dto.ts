import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserPasswordDto {
  @ApiProperty({ example: 'senhaAtual', required: false })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: 'novaSenha', required: false })
  @IsString()
  @IsNotEmpty()
  newPassword: string;
}
