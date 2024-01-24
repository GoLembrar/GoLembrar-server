import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CredentialsDto } from './dto/credentials.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { OkResponse } from '../swagger/decorators/ok.decorator';
import { OkResponseModel } from './swagger/okResponseModel.swagger';
import { Unauthorized } from '../swagger/decorators/unauthorized.decorators';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post()
  @ApiOperation({ summary: 'Login' })
  @OkResponse(OkResponseModel)
  @Unauthorized()
  login(@Body() credentials: CredentialsDto) {
    return this.authService.login(credentials);
  }
}
