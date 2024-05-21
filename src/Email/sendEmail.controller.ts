import { Controller, Get } from '@nestjs/common';
import { SendEmailService } from './sendEmail.service';

@Controller('/send-email')
export class SendEmailController {
  constructor(private readonly sendEmailService: SendEmailService) {}
  @Get()
  async sendMessage() {
    return this.sendEmailService.sendEmail();
  }
}
