import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator';

export class CredentialsDto {
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(100)
  @ApiProperty({ example: 'user@email.com' })
  email: string;

  @IsNotEmpty()
  @MaxLength(25)
  @ApiProperty({ example: '123456' })
  password: string;
}
