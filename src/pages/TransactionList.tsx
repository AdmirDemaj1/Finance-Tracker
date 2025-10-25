import React from 'react';
import { useNavigate } from 'react-router-dom';
import TransactionListComponent from '../components/transactions/TransactionList';
import DateFilter from '../components/common/DateFilter';
import { useTransactions } from '../hooks/useTransactions';
import { useDateFilter } from '../hooks/useDateFilter';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { Transaction } from '../types';

const TransactionListPage: React.FC = () => {
  const { transactions, isLoading, deleteTransaction } = useTransactions();
  const navigate = useNavigate();
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
    return <LoadingSpinner message="Loading transactions..." />;
  }

  const handleEdit = (transaction: Transaction) => {
    navigate(`/transactions/${transaction.id}/edit`, { state: { transaction } });
  };

  const handleDelete = async (id: string) => {
    await deleteTransaction(id);
  };

  return (
    <section className="section-list">
      <h2>Transaction History</h2>
      <DateFilter
        preset={preset}
        customRange={customRange}
        onPresetChange={setPreset}
        onCustomRangeChange={setCustomRange}
        onReset={resetFilter}
      />
      <TransactionListComponent
        transactions={filteredTransactions}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />
    </section>
  );
};

export default TransactionListPage;
