import React, { useMemo } from "react";
import { useFinancialSummary } from "../../hooks/useFinancialSummary";
import { useCurrency } from "../../contexts/CurrencyContext";
import { Transaction } from "../../types";

interface FinancialSummaryProps {
  transactions: Transaction[];
}

const FinancialSummary: React.FC<FinancialSummaryProps> = ({
  transactions,
}) => {
  const { displayCurrency, convertAmount } = useCurrency();
  
  // Convert all transactions to display currency
  const convertedTransactions = useMemo(() => {
    return transactions.map(transaction => ({
      ...transaction,
      amount: convertAmount(transaction.amount, transaction.currency)
    }));
  }, [transactions, convertAmount]);

  const { totalIncome, totalExpenses, balance, categoryBreakdown, statistics } =
    useFinancialSummary(convertedTransactions);

  const formatCurrency = (amount: number): string => {
    // Ensure the amount is a proper number and limit to 2 decimal places
    const parsedAmount = parseFloat(amount.toFixed(2));
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: displayCurrency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(parsedAmount);
  };

  const balanceClass =
    balance > 0
      ? "balance positive"
      : balance < 0
      ? "balance negative"
      : "balance neutral";

  const topExpenseCategories = Object.entries(categoryBreakdown.expense)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  const topIncomeCategories = Object.entries(categoryBreakdown.income)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  return (
    <div className="financial-summary">
      <h2>Financial Overview</h2>

      <div className="summary-cards">
        <div className="summary-card card-balance">
          <div className="card-header">
            <span className="card-icon">💰</span>
            <h3>Current Balance</h3>
          </div>
          <div className={balanceClass}>{formatCurrency(balance)}</div>
          <p className="card-subtitle">
            {balance >= 0
              ? "You're doing great! Keep it up."
              : "Your expenses exceed your income."}
          </p>
        </div>

        <div className="summary-card card-income">
          <div className="card-header">
            <span className="card-icon">📈</span>
            <h3>Total Income</h3>
          </div>
          <div className="amount income-amount">
            {formatCurrency(totalIncome)}
          </div>
          <p className="card-subtitle">
            {statistics.incomeCount} transaction
            {statistics.incomeCount !== 1 ? "s" : ""}
            {statistics.incomeCount > 0 && (
              <> • Avg: {formatCurrency(statistics.averageIncome)}</>
            )}
          </p>
        </div>

        <div className="summary-card card-expense">
          <div className="card-header">
            <span className="card-icon">📉</span>
            <h3>Total Expenses</h3>
          </div>
          <div className="amount expense-amount">
            {formatCurrency(totalExpenses)}
          </div>
          <p className="card-subtitle">
            {statistics.expenseCount} transaction
            {statistics.expenseCount !== 1 ? "s" : ""}
            {statistics.expenseCount > 0 && (
              <> • Avg: {formatCurrency(statistics.averageExpenses)}</>
            )}
          </p>
        </div>
      </div>

      {statistics.transactionCount > 0 && (
        <div className="summary-details">
          {topExpenseCategories.length > 0 && (
            <div className="category-breakdown">
              <h4>Top Spending Categories</h4>
              <div className="category-list">
                {topExpenseCategories.map(([category, amount]) => (
                  <div key={category} className="category-item">
                    <span className="category-name">{category}</span>
                    <span className="category-amount expense-amount">
                      {formatCurrency(amount)}
                    </span>
                    <div className="category-bar">
                      <div
                        className="category-bar-fill expense-bar"
                        style={{
                          width: `${(amount / totalExpenses) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="category-percentage">
                      {((amount / totalExpenses) * 100).toFixed(1)}% of expenses
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {topIncomeCategories.length > 0 && (
            <div className="category-breakdown">
              <h4>Top Income Sources</h4>
              <div className="category-list">
                {topIncomeCategories.map(([category, amount]) => (
                  <div key={category} className="category-item">
                    <span className="category-name">{category}</span>
                    <span className="category-amount income-amount">
                      {formatCurrency(amount)}
                    </span>
                    <div className="category-bar">
                      <div
                        className="category-bar-fill income-bar"
                        style={{
                          width: `${(amount / totalIncome) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="category-percentage">
                      {((amount / totalIncome) * 100).toFixed(1)}% of income
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="quick-stats">
            <div className="stat-item">
              <span className="stat-label">Total Transactions:</span>
              <span className="stat-value">{statistics.transactionCount}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Savings Rate:</span>
              <span className="stat-value">
                {totalIncome > 0
                  ? `${((balance / totalIncome) * 100).toFixed(1)}%`
                  : "N/A"}
              </span>
            </div>
          </div>
        </div>
      )}

      {statistics.transactionCount === 0 && (
        <div className="summary-empty">
          <p>Add some transactions to see your financial summary!</p>
        </div>
      )}
    </div>
  );
};

export default FinancialSummary;
