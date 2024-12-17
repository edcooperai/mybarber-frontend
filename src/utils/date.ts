import { format, parseISO, isValid } from 'date-fns';

export const formatDate = (date: string | Date, formatStr: string = 'PPP'): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) {
      throw new Error('Invalid date');
    }
    return format(dateObj, formatStr);
  } catch (error) {
    console.error('Date formatting error:', error);
    return 'Invalid date';
  }
};

export const formatTime = (date: string | Date): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) {
      throw new Error('Invalid date');
    }
    return format(dateObj, 'HH:mm');
  } catch (error) {
    console.error('Time formatting error:', error);
    return 'Invalid time';
  }
};