export function formatDateISO(date: Date = new Date()): string {
  return date.toISOString().split('T')[0];
}

export function formatDateLocale(
  date: Date = new Date(),
  locale: string = 'en-US'
): string {
  return date.toLocaleDateString(locale);
}

export function getFileTimestamp(): string {
  return Date.now().toString();
}