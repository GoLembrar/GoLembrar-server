import { IsNotEmpty, IsString } from 'class-validator';

export class CreateContactDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  identify: string;

  @IsNotEmpty()
  @IsString()
  platform: string;

  @IsNotEmpty()
  userId: string;
}
