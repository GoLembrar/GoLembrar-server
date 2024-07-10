import { Test, TestingModule } from '@nestjs/testing';
import { EmailScheduledService } from './email.service';

describe('EmailService', () => {
  let service: EmailScheduledService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailScheduledService],
    }).compile();

    service = module.get<EmailScheduledService>(EmailScheduledService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
