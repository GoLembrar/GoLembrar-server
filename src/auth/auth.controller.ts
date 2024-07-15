import { Body, Controller, Post, Put } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CredentialsDto } from './dto/credentials.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { OkResponse } from '../swagger/decorators/ok.decorator';
import { OkResponseModel } from './swagger/okResponseModel.swagger';
import { UnauthorizedResponse } from '../swagger/decorators/unauthorized.decorator';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post()
  @ApiOperation({ summary: 'Login' })
  @OkResponse(OkResponseModel)
  @UnauthorizedResponse()
  login(@Body() credentials: CredentialsDto) {
    return this.authService.login(credentials);
  }

  @Post('refresh-token')
  async refreshToken(@Body() body: { refreshToken: string }) {
    return this.authService.refreshToken(body.refreshToken);
  }
}
