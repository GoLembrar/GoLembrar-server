/* 
model Contact {
  id       Int       @id @default(autoincrement())
  name     String    @db.VarChar(128)
  identify String    @db.VarChar(64)
  platform Platforms
  user     Users     @relation(fields: [usersId], references: [id])
  usersId  Int

  @@index([name, identify])
  @@map("contacts")
}

enum Platforms {
  WHATSAPP
  TELEGRAM
  EMAIL
  DISCORD
}
*/

import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateContactDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  @IsNotEmpty()
  identify: string;

  @IsNotEmpty()
  @IsString()
  platform: string;

  @IsNotEmpty()
  @IsInt()
  userId: number;
}
