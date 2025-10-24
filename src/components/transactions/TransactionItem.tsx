import React from "react";
import { Transaction, TransactionType } from "../../types";

interface TransactionItemProps {
  transaction: Transaction;
  onDelete: (id: string) => void;
  onEdit?: (transaction: Transaction) => void;
}

const TransactionItem: React.FC<TransactionItemProps> = ({
  transaction,
  onDelete,
  onEdit,
}) => {
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const transactionClass =
    transaction.type === TransactionType.INCOME
      ? "transaction-item income"
      : "transaction-item expense";

  const amountClass =
    transaction.type === TransactionType.INCOME
      ? "amount positive"
      : "amount negative";

  const handleDelete = (): void => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this transaction? This action cannot be undone."
    );

    if (confirmed) {
      onDelete(transaction.id);
    }
  };

  return (
    <div className={transactionClass}>
      <div className="transaction-details">
        <div className="transaction-header">
          <h4 className="category">{transaction.category}</h4>
          <span className="date">{formatDate(transaction.date)}</span>
        </div>

        {transaction.description && (
          <p className="description">{transaction.description}</p>
        )}

        <span className="type-badge">
          {transaction.type === TransactionType.INCOME ? "💰" : "💸"}
          {transaction.type}
        </span>
      </div>

      <div className="transaction-actions">
        <div className={amountClass}>
          {transaction.type === TransactionType.INCOME ? "+" : "-"}
          {formatCurrency(Math.abs(transaction.amount))}
        </div>

        <div className="action-buttons">
          {onEdit && (
            <button
              onClick={() => onEdit(transaction)}
              className="btn-icon"
              aria-label="Edit transaction"
              title="Edit"
            >
              ✏️
            </button>
          )}

          <button
            onClick={handleDelete}
            className="btn-icon btn-danger"
            aria-label="Delete transaction"
            title="Delete"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionItem;
