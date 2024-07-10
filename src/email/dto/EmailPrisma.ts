import { EmailStatus, Users } from '@prisma/client';

export interface EmailPrisma {
  id: number;
  ownerId: string;
  owner?: Users; // Relação com o modelo User
  from: string;
  to: string;
  subject: string;
  html: string;
  dueDate: Date;
  status: EmailStatus;
}
