import { Channel, Status } from '@prisma/client';

export interface ScheduledReminder {
  scheduled: string;
  channel: Channel;
  reminders_count: bigint;
  reminders: ReminderResponse[];
}

export interface ReminderResponse {
  id: number;
  reminder_id: string;
  reminder_title: string;
  reminder_description: string;
  reminder_status: Status;
  reminder_created_at: string;
  reminder_scheduled: string;
  contact_id: string;
  contact_identify: string;
  contact_channel: string;
}
