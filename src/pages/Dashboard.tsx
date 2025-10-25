import React from 'react';
import FinancialSummary from '../components/summary/FinancialSummary';
import DateFilter from '../components/common/DateFilter';
import { useTransactions } from '../hooks/useTransactions';
import { useDateFilter } from '../hooks/useDateFilter';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Dashboard: React.FC = () => {
  const { transactions, isLoading } = useTransactions();
  const { 
    preset, 
    customRange, 
    setPreset, 
    setCustomRange, 
    filterTransactions,
    resetFilter 
  } = useDateFilter();

  const filteredTransactions = filterTransactions(transactions);

  if (isLoading && transactions.length === 0) {
    return <LoadingSpinner message="Loading your financial summary..." />;
  }

  return (
    <section className="section-summary">
      <DateFilter
        preset={preset}
        customRange={customRange}
        onPresetChange={setPreset}
        onCustomRangeChange={setCustomRange}
        onReset={resetFilter}
      />
      <FinancialSummary transactions={filteredTransactions} />
    </section>
  );
};

export default Dashboard;
