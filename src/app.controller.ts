import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { Response } from 'express';

@Controller()
@ApiExcludeController(true)
export class AppController {
  @Get()
  redirectToDocs(@Res() response: Response) {
    response.redirect('/docs');
  }

  @Get('/check')
  public checkHelth(@Res() res: Response) {
    return res.status(HttpStatus.OK).json({ status: 'ok' });
  }
}
