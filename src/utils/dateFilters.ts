export type DateFilterPreset = 
  | 'all'
  | 'today'
  | 'yesterday'
  | 'thisWeek'
  | 'lastWeek'
  | 'thisMonth'
  | 'lastMonth'
  | 'thisYear'
  | 'custom';

export interface DateRange {
  startDate: string;
  endDate: string;
}

// belper to format date to YYYY-MM-DD
const toDateString = (date: Date): string => date.toISOString().split('T')[0];

// helper to add/subtract days
const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const getDateRangeForPreset = (preset: DateFilterPreset): DateRange | null => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  
  switch (preset) {
    case 'all':
      return null;
      
    case 'today':
      return {
        startDate: toDateString(today),
        endDate: toDateString(today),
      };
      
    case 'yesterday':
      const yesterday = addDays(today, -1);
      return {
        startDate: toDateString(yesterday),
        endDate: toDateString(yesterday),
      };
      
    case 'thisWeek':
      const weekStart = addDays(today, -today.getDay());
      return {
        startDate: toDateString(weekStart),
        endDate: toDateString(today),
      };
      
    case 'lastWeek':
      const lastWeekStart = addDays(today, -today.getDay() - 7);
      const lastWeekEnd = addDays(today, -today.getDay() - 1);
      return {
        startDate: toDateString(lastWeekStart),
        endDate: toDateString(lastWeekEnd),
      };
      
    case 'thisMonth':
      return {
        startDate: toDateString(new Date(year, month, 1)),
        endDate: toDateString(new Date(year, month + 1, 0)),
      };
      
    case 'lastMonth':
      return {
        startDate: toDateString(new Date(year, month - 1, 1)),
        endDate: toDateString(new Date(year, month, 0)),
      };
      
    case 'thisYear':
      return {
        startDate: toDateString(new Date(year, 0, 1)),
        endDate: toDateString(new Date(year, 11, 31)),
      };
      
    case 'custom':
      return null;
      
    default:
      return null;
  }
};

export const isDateInRange = (dateString: string, range: DateRange | null): boolean => {
  if (!range) return true;
  

  return dateString >= range.startDate && dateString <= range.endDate;
};

export const formatDateRange = (preset: DateFilterPreset, customRange?: DateRange): string => {
  if (preset === 'all') return 'All Time';
  
  if (preset === 'custom' && customRange) {
    const start = new Date(customRange.startDate).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
    const end = new Date(customRange.endDate).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
    return `${start} - ${end}`;
  }
  
  const presetLabels: Record<DateFilterPreset, string> = {
    all: 'All Time',
    today: 'Today',
    yesterday: 'Yesterday',
    thisWeek: 'This Week',
    lastWeek: 'Last Week',
    thisMonth: 'This Month',
    lastMonth: 'Last Month',
    thisYear: 'This Year',
    custom: 'Custom Range',
  };
  
  return presetLabels[preset];
};

