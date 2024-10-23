import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { ApiExcludeEndpoint, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { BadRequestResponse } from './swagger/decorators/bad-request.decorator';
import { OkHealthResponse } from './swagger/decorators/ok.decorator';

@Controller()
export class AppController {
  @Get()
  @ApiExcludeEndpoint(true)
  redirectToDocs(@Res() response: Response) {
    response.redirect('/docs');
  }

  @Get('/check')
  @ApiTags('health')
  @BadRequestResponse()
  @OkHealthResponse('Status "ok" API is running properly', {
    status: "ok"
  })
  @ApiOperation({ summary: 'Check if API is running' })
  public checkHelth(@Res() res: Response) {
    return res.status(HttpStatus.OK).json({ status: 'ok' });
  }
}
