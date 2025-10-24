export enum TransactionType {
  INCOME = "income",
  EXPENSE = "expense",
}

export type IncomeCategory = "Salary" | "Freelance" | "Investment" | "Other";
export type ExpenseCategory =
  | "Food"
  | "Housing"
  | "Transport"
  | "Entertainment"
  | "HealthCare"
  | "Education"
  | "Other";

export type Category = IncomeCategory | ExpenseCategory;

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  category: Category | '';
  date: string;
  description: string;
  currency: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TransactionFormData {
  amount: string | number;
  type: TransactionType;
  category: Category | '';
  date: string;
  description: string;
  currency: string;
}

export interface TransactionState {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
}

export enum ActionType {
  SET_TRANSACTIONS = "SET_TRANSACTIONS",
  ADD_TRANSACTION = "ADD_TRANSACTION",
  UPDATE_TRANSACTION = "UPDATE_TRANSACTION",
  DELETE_TRANSACTION = "DELETE_TRANSACTION",
  SET_LOADING = "SET_LOADING",
  SET_ERROR = "SET_ERROR",
}

export type TransactionAction =
  | {
      type: ActionType.SET_TRANSACTIONS;
      payload: Transaction[];
    }
  | {
      type: ActionType.ADD_TRANSACTION;
      payload: Transaction;
    }
  | {
      type: ActionType.UPDATE_TRANSACTION;
      payload: { id: string, updates: Partial<Transaction> };
    }
  | {
      type: ActionType.DELETE_TRANSACTION;
      // TODO: Maybe I can use UUID for the id instead of string
      payload: string;
    }
  | {
      type: ActionType.SET_LOADING;
      payload: boolean;
    }
  | {
      type: ActionType.SET_ERROR;
      payload: string | null;
    };

export type ApiResponse<T> = {
  data?: T;
  error?: string;
  success: boolean;
};

export interface CategoryBreakdown {
  income: Record<string, number>;
  expense: Record<string, number>;
}

export interface FinancialStatistics {
  transactionCount: number;
  incomeCount: number;
  expenseCount: number;
  averageIncome: number;
  averageExpenses: number;
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  categoryBreakdown: CategoryBreakdown;
  recentTransactions: Transaction[];
  statistics: FinancialStatistics;
}


// Form validation types
export type ValidationRule<T = any> = (value: T, allValues: any) => string | null;

export interface ValidationRules {
  [fieldName: string]: ValidationRule;
}

export interface FormErrors {
  [fieldName: string]: string;
}

export interface TouchFields {
  [fieldName: string]: boolean;
}


// Custom Hook return types
export interface UseTransactionsReturn {
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  addTransaction: (data: TransactionFormData) => Promise<ApiResponse<Transaction>>;
  deleteTransaction: (id: string) => Promise<ApiResponse<null>>;
  updateTransaction: (id: string, updates: Partial<Transaction>) => Promise<ApiResponse<Transaction>>;
  clearError: () => void;
}

export interface UseFormReturn<T> {
  values: T;
  errors: FormErrors;
  touched: TouchFields;
  isSubmitting: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  handleBlur: (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  reset: () => void;
  setFieldValue: (fieldName: string, value: any) => void;
  shouldShowError: (fieldName: string) => boolean;
}