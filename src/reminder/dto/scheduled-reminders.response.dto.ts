import { Channel, Status } from '@prisma/client';

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
  contact_channel: Channel;
}
