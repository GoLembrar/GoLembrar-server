import { ApiProperty } from '@nestjs/swagger';

export class OkLoginModel {
  @ApiProperty({
    description: 'JWT access token to be used for authenticated requests',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  token: string;

  @ApiProperty({
    description: 'JWT refresh token for obtaining a new access token',
    example: 'dGhpc2lzYXJlZnJlc2h0b2tlbg...',
  })
  refreshToken: string;
}
