import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CredentialsDto } from './dto/credentials.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { OkResponse } from '../swagger/decorators/ok.decorator';
import { OkResponseModel } from './swagger/okResponseModel.swagger';
import { UnauthorizedResponse } from '../swagger/decorators/unauthorized.decorator';
import { Response } from 'express';
import { RequestWithUser } from '../common/utils/types/RequestWithUser';

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

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh the tokens' })
  @HttpCode(HttpStatus.OK)
  async refreshToken(
    @Req() request: RequestWithUser,
    @Res() response: Response,
  ) {
    const tokens = await this.authService.refreshTokens(
      request.user.refreshToken,
      request.user.id,
    );

    return response.status(HttpStatus.OK).json({ tokens });
  }
}
