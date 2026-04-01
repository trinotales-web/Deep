import { format, subDays, parseISO, isToday, startOfMonth } from 'date-fns';

export function today(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

export function currentMonth(): string {
  return format(new Date(), 'yyyy-MM');
}

export function last7Days(): string[] {
  return Array.from({ length: 7 }, (_, i) =>
    format(subDays(new Date(), 6 - i), 'yyyy-MM-dd')
  );
}

export function formatDate(date: string): string {
  return format(parseISO(date), 'MMM d, yyyy');
}

export function formatMonthYear(month: string): string {
  const [year, m] = month.split('-');
  const d = new Date(parseInt(year), parseInt(m) - 1);
  return format(d, 'MMMM yyyy');
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export function getDayName(dateStr: string): string {
  return format(parseISO(dateStr), 'EEE');
}

export function getDayNumber(dateStr: string): string {
  return format(parseISO(dateStr), 'd');
}

export function isTodayDate(dateStr: string): boolean {
  return isToday(parseISO(dateStr));
}

export function formatDayFull(): string {
  return format(new Date(), 'EEEE, MMMM d');
}
