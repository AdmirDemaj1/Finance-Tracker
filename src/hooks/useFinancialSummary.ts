import { useMemo } from "react";
import { Transaction, TransactionType, FinancialSummary } from "../types";

export const useFinancialSummary = (
  transactions: Transaction[]
): FinancialSummary => {
  const totalIncome = useMemo((): number => {
    return transactions
      .filter((t) => t.type === TransactionType.INCOME)
      .reduce((sum, transaction) => sum + Math.abs(transaction.amount), 0);
  }, [transactions]);

  const totalExpenses = useMemo((): number => {
    return transactions
      .filter((t) => t.type === TransactionType.EXPENSE)
      .reduce((sum, transaction) => sum + Math.abs(transaction.amount), 0);
  }, [transactions]);

  const balance = useMemo((): number => {
    // Calculate balance as income minus expenses (using the already calculated totals)
    return totalIncome - totalExpenses;
  }, [totalIncome, totalExpenses]);

  const categoryBreakdown = useMemo(() => {
    const breakdown: FinancialSummary["categoryBreakdown"] = {
      income: {},
      expense: {},
    };

    transactions.forEach((transaction) => {
      const type = transaction.type;
      const category = transaction.category;
      const amount = Math.abs(transaction.amount);

      if (!breakdown[type][category]) {
        breakdown[type][category] = 0;
      }

      breakdown[type][category] += amount;
    });

    return breakdown;
  }, [transactions]);

  const recentTransactions = useMemo((): Transaction[] => {
    return transactions.slice(0, 5);
  }, [transactions]);

  const statistics = useMemo(() => {
    const incomeTransactions = transactions.filter(
      (t) => t.type === TransactionType.INCOME
    );
    const expenseTransactions = transactions.filter(
      (t) => t.type === TransactionType.EXPENSE
    );

    return {
      transactionCount: transactions.length,
      incomeCount: incomeTransactions.length,
      expenseCount: expenseTransactions.length,
      averageIncome:
        incomeTransactions.length > 0
          ? totalIncome / incomeTransactions.length
          : 0,
      averageExpenses:
        expenseTransactions.length > 0
          ? totalExpenses / expenseTransactions.length
          : 0,
    };
  }, [transactions, totalIncome, totalExpenses]);

  return {
    totalIncome,
    totalExpenses,
    balance,
    categoryBreakdown,
    recentTransactions,
    statistics,
  };
};
