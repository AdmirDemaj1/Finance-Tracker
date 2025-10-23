import { TransactionType, IncomeCategory, ExpenseCategory } from "../types";

export const TRANSACTION_TYPES = {
  INCOME: TransactionType.INCOME,
  EXPENSE: TransactionType.EXPENSE,
};

export const CATEGORIES = {
  INCOME: [
    "Salary",
    "Freelance",
    "Investment",
    "Other",
  ] as const satisfies readonly IncomeCategory[],
  EXPENSE: [
    "Food",
    "Housing",
    "Transport",
    "Entertainment",
    "HealthCare",
    "Education",
    "Other",
  ] as const satisfies readonly ExpenseCategory[],
};

export const STORAGE_KEY = "mykeyyyyyyy" as const;


export function isIncomeCategory(category: string): category is IncomeCategory {
  return (CATEGORIES.INCOME as readonly string[]).includes(category);
}

export function isExpenseCategory(
  category: string
): category is ExpenseCategory {
  return (CATEGORIES.EXPENSE as readonly string[]).includes(category);
}
