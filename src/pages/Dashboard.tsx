import React from 'react';
import FinancialSummary from '../components/summary/FinancialSummary';
import { useTransactions } from '../hooks/useTransactions';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Dashboard: React.FC = () => {
  const { transactions, isLoading } = useTransactions();

  if (isLoading && transactions.length === 0) {
    return <LoadingSpinner message="Loading your financial summary..." />;
  }

  return (
    <section className="section-summary">
      <FinancialSummary transactions={transactions} />
    </section>
  );
};

export default Dashboard;
