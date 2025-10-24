import React from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import TransactionFormComponent from '../components/transactions/TransactionForm';
import { useTransactions } from '../hooks/useTransactions';
import { TransactionFormData } from '../types';

const TransactionFormPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { addTransaction, updateTransaction } = useTransactions();

  const editingTransaction = location.state?.transaction;
  const isEditing = Boolean(id && editingTransaction);

  const handleSubmit = async (data: TransactionFormData) => {
    if (isEditing && id) {
      await updateTransaction(id, {
        ...data,
        amount: typeof data.amount === 'string' ? parseFloat(data.amount) : data.amount
      });
    } else {
      await addTransaction(data);
    }
    navigate('/transactions');
  };

  const handleCancel = () => {
    navigate('/transactions');
  };

  return (
    <section className="section-form">
      <TransactionFormComponent
        onSubmit={handleSubmit}
        initialData={isEditing ? editingTransaction : null}
        onCancel={handleCancel}
      />
    </section>
  );
};

export default TransactionFormPage;
