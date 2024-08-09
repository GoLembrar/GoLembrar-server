import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Max } from 'class-validator';

export class CredentialsDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: 'user@email.com' })
  @Max(100)
  email: string;

  @IsNotEmpty()
  @Max(25)
  @ApiProperty({ example: '123456' })
  password: string;
}
