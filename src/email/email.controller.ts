import { Controller } from '@nestjs/common';
import { EmailScheduledService } from './email.service';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailScheduledService) {}
}
