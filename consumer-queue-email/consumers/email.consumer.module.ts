import { Module } from '@nestjs/common';
import { EmailConsumer } from './email.consumer';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [EmailModule],
  providers: [EmailConsumer],
})
export class EmailConsumerModule {}
