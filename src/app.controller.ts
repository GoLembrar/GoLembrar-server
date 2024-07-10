import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller()
export class AppController {
  @Get()
  redirectToDocs(@Res() response: Response) {
    response.redirect('/docs');
  }
}
