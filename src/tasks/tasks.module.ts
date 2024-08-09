import { Module } from '@nestjs/common';
import { EmailScheduledModule } from '../email/email.module';
import { TasksService } from './tasks.service';

@Module({
  imports: [EmailScheduledModule],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}
