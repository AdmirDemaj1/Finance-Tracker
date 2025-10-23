import { Transaction, TransactionFormData, ApiResponse, Category } from "../types";
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

    if(!Array.isArray(parsedData)) {
      return [];
    }

    return parsedData as Transaction[]; 

  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw new Error("Failed to fetch transactions");
  }
};

export const createTransaction = async (transactionData: TransactionFormData): Promise<Transaction> => {
  await delay(300);

  try {
    // Simple validation first
    // TODO:: Use library in future for validation like Zod or react hook form
    if (!transactionData.amount || !transactionData.type || !transactionData.category) {
        throw new Error("Invalid transaction data");
    }

    const newTransaction: Transaction = {
      ...transactionData,
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
}

export const deleteTransaction = async (id: string): Promise<{ success: boolean; id: string }> => {
    await delay(300);

    try {
        const existingTransactions = await fetchTransactions();
        const updatedTransactions = existingTransactions.filter(transaction => transaction.id !== id);
        if (updatedTransactions.length === existingTransactions.length) {
            throw new Error("Transaction not found");
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTransactions));
        return { success: true, id };
    } catch (error) {
        console.error("Error deleting transaction:", error);
        throw new Error("Failed to delete transaction");
    }
}
