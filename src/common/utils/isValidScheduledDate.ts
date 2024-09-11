export function isValidScheduledDate(date: Date, minute: number): boolean {
  const now = new Date().getTime();
  const dateFormatted = new Date(date).getTime();

  const utcOffset = -3 * 60 * 60 * 1000;
  const currentTime = new Date(now + utcOffset);

  const minimumScheduleTime = currentTime.getTime() + minute * 60 * 1000; // milissegundos
  const reminderDateBrasilia = new Date(dateFormatted).getTime();

  return reminderDateBrasilia > minimumScheduleTime;
}
