import {
  Transaction,
  TransactionFormData,
  TransactionType,
} from "../types";
import { STORAGE_KEY } from "../utils/constants";

const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const fetchTransactions = async (): Promise<Transaction[]> => {
  await delay(500);

  try {
    const data = localStorage.getItem(STORAGE_KEY);

    if (!data) {
      return [];
    }

    const parsedData = JSON.parse(data);

    if (!Array.isArray(parsedData)) {
      return [];
    }

    return parsedData as Transaction[];
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw new Error("Failed to fetch transactions");
  }
};

export const createTransaction = async (
  transactionData: TransactionFormData
): Promise<Transaction> => {
  await delay(300);

  try {
    // Simple validation first
    // TODO:: Use library in future for validation like Zod or react hook form
    if (
      !transactionData.amount ||
      !transactionData.type ||
      !transactionData.category
    ) {
      throw new Error("Invalid transaction data");
    }

    // Convert amount to number with 2 decimal places and handle expense sign
    const numericAmount = typeof transactionData.amount === 'string' 
      ? parseFloat(transactionData.amount || '0') 
      : transactionData.amount;
      
    const amount = transactionData.type === TransactionType.EXPENSE 
      ? -Math.abs(numericAmount) 
      : Math.abs(numericAmount);

    const newTransaction: Transaction = {
      ...transactionData,
      amount,
      id: Date.now().toString() + Math.random().toString(36).substring(2, 15),
      category: transactionData.category as any,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const existingTransactions = await fetchTransactions();
    const updatedTransactions = [newTransaction, ...existingTransactions];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTransactions));

    return newTransaction;
  } catch (error) {
    console.error("Error creating transaction:", error);
    throw new Error("Failed to create transaction");
  }
};

export const deleteTransaction = async (
  id: string
): Promise<{ success: boolean; id: string }> => {
  await delay(300);

  try {
    const existingTransactions = await fetchTransactions();
    const updatedTransactions = existingTransactions.filter(
      (transaction) => transaction.id !== id
    );
    if (updatedTransactions.length === existingTransactions.length) {
      throw new Error("Transaction not found");
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTransactions));
    return { success: true, id };
  } catch (error) {
    console.error("Error deleting transaction:", error);
    throw new Error("Failed to delete transaction");
  }
};

export const updateTransaction = async (
  id: string,
  updates: Partial<Transaction>
): Promise<Transaction> => {
  await delay(300);

  try {
    const existingTransactions = await fetchTransactions();
    let foundTransaction = false;

    const updatedTransactions = existingTransactions.map((transaction) => {
      if (transaction.id === id) {
        foundTransaction = true;
        const updatedData = {
          ...transaction,
          ...updates,
          id,
          updatedAt: new Date().toISOString(),
        };

        // Ensure amount is properly formatted and signed
        if (typeof updatedData.amount === 'number') {
          const parsedAmount = parseFloat(updatedData.amount.toString()).toFixed(2);
          updatedData.amount = updatedData.type === TransactionType.EXPENSE
            ? -Math.abs(parseFloat(parsedAmount))
            : Math.abs(parseFloat(parsedAmount));
        }

        return updatedData;
      }
      return transaction;
    });

    if (!foundTransaction) {
      throw new Error("Transaction not found");
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTransactions));

    const updatedTransaction = updatedTransactions.find((t) => t.id === id);

    if (!updatedTransaction) {
      throw new Error("Transaction not found after update");
    }

    return updatedTransaction;
  } catch (error) {
    console.error("Error updating transaction:", error);
    throw new Error("Failed to update transaction");
  }
};

export const clearAllTransactions = async (): Promise<{ success: boolean }> => {
  await delay(200);

  localStorage.removeItem(STORAGE_KEY);
  return { success: true };
};


