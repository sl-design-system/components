export function isSameDate(day1?: Date, day2?: Date): boolean {
  return (
    day1 instanceof Date &&
    day2 instanceof Date &&
    day1.getDate() === day2.getDate() &&
    day1.getMonth() === day2.getMonth() &&
    day1.getFullYear() === day2.getFullYear()
  );
}

export function isDateInList(date: Date, list?: Date[] | string): boolean {
  if (!list) {
    return false;
  }

  if (typeof list === 'string') {
    list = list.split(',').map(item => new Date(item));
  }

  return list.some(item => isSameDate(item, date));
}

export function normalizeDateTime(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}
