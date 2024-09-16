export function getDatesInISO(): {
  startOfDay: string;
  endOfDay: string;
} {
  const offsetBrasilia = -3; // UTC-3

  function getFirstHourOfDay(date: Date): string {
    date.setHours(0, 0, 0, 0);
    return new Date(
      date.getTime() + offsetBrasilia * 60 * 60 * 1000,
    ).toISOString();
  }

  function getLastHourOfDay(date: Date): string {
    date.setHours(23, 59, 0, 0); // Define para 23:59 com segundos zerados
    return new Date(
      date.getTime() + offsetBrasilia * 60 * 60 * 1000,
    ).toISOString();
  }

  const today = new Date();

  const startOfDay = getFirstHourOfDay(new Date(today));
  const endOfDay = getLastHourOfDay(new Date(today));

  return {
    startOfDay,
    endOfDay,
  };
}
