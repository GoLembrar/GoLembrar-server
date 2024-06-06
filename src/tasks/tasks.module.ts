import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { EmailScheduledModule } from '../email/email.module';

@Module({
    imports: [EmailScheduledModule],
    providers: [TasksService],
})
export class TasksModule {}
