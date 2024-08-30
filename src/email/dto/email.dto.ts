export interface EmailsToSendDto {
  emails: string[];
  subject: string;
  message: string;
  scheduled: Date;
}

export interface EmailDto {
  from: string;
  to: string;
  subject: string;
  html: string;
}
