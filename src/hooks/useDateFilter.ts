import { useState, useMemo, useCallback } from 'react';
import { Transaction } from '../types';
import { 
  DateFilterPreset, 
  DateRange, 
  getDateRangeForPreset, 
  isDateInRange 
} from '../utils/dateFilters';

export interface UseDateFilterReturn {
  preset: DateFilterPreset;
  customRange: DateRange | null;
  activeRange: DateRange | null;
  setPreset: (preset: DateFilterPreset) => void;
  setCustomRange: (range: DateRange) => void;
  filterTransactions: (transactions: Transaction[]) => Transaction[];
  resetFilter: () => void;
}

export const useDateFilter = (): UseDateFilterReturn => {
  const [preset, setPresetState] = useState<DateFilterPreset>('all');
  const [customRange, setCustomRange] = useState<DateRange | null>(null);

  const activeRange = useMemo(() => {
    if (preset === 'custom') {
      return customRange;
    }
    return getDateRangeForPreset(preset);
  }, [preset, customRange]);

  const setPreset = useCallback((newPreset: DateFilterPreset) => {
    setPresetState(newPreset);
    if (newPreset !== 'custom') {
      setCustomRange(null);
    }
  }, []);

  const filterTransactions = useCallback((transactions: Transaction[]): Transaction[] => {
    if (!activeRange) {
      return transactions;
    }
    
    return transactions.filter(transaction => 
      isDateInRange(transaction.date, activeRange)
    );
  }, [activeRange]);

  const resetFilter = useCallback(() => {
    setPresetState('all');
    setCustomRange(null);
  }, []);

  return {
    preset,
    customRange,
    activeRange,
    setPreset,
    setCustomRange,
    filterTransactions,
    resetFilter,
  };
};

