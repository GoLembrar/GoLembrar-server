export function isWithinCurrentDay(date: Date): boolean {
  const today = new Date();
  const nextDay = today.setDate(today.getDate() + 1);
  const offset = -3 * 60 * 60 * 1000; // -3 horas em milissegundos

  const nextDayFormatted = new Date(nextDay);
  nextDayFormatted.setHours(0, 0, 0, 0);
  const nextDayWithoutOffset = new Date(nextDayFormatted.getTime() + offset);

  const dateFormatted = new Date(date);

  return dateFormatted < nextDayWithoutOffset;
}
