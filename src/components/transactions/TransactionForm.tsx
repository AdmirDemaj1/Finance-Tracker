import React, { useEffect, useState } from "react";
import { useForm } from "../../hooks/useForm";
import {
  TransactionType,
  TransactionFormData,
  ValidationRule,
} from "../../types";
import { CATEGORIES } from "../../utils/constants";
import { fetchCurrencies, Currency } from "../../services/currencyApi";

interface TransactionFormProps {
  onSubmit: (data: TransactionFormData) => Promise<void> | void;
  initialData?: TransactionFormData | null;
  onCancel?: (() => void) | null;
}

// Todo:: Can use react hook form for validation instead of this.
const validationRules: Record<string, ValidationRule> = {
  type: (value: string): string | null => {
    if (!value) return "Transaction type is required";
    return null;
  },

  amount: (value: string | number): string | null => {
    if (!value) return "Amount is required";
    
    const numValue = parseFloat(value.toString());
    if (isNaN(numValue)) return "Amount must be a number";
    if (numValue <= 0) return "Amount must be greater than 0";
    if (numValue > 999999.99) return "Amount cannot exceed 999,999.99";

    return null;
  },

  category: (value: string): string | null => {
    if (!value) return "Category is required";
    return null;
  },

  currency: (value: string): string | null => {
    if (!value) return "Currency is required";
    return null;
  },

  description: (value: string): string | null => {
    if (!value || value.trim() === '') return "Description is required";
    if (value.trim().length > 200) {
      return "Description must be less than 200 characters";
    }
    return null;
  },

  date: (value: string): string | null => {
    if (!value) return "Date is required";
    return null;
  },
};

const TransactionForm: React.FC<TransactionFormProps> = ({
  onSubmit,
  initialData = null,
  onCancel = null,
}) => {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [loadingCurrencies, setLoadingCurrencies] = useState<boolean>(true);

  const initialValues: TransactionFormData = initialData || {
    type: TransactionType.EXPENSE,
    amount: '',
    category: "",
    description: "",
    currency: "USD",
    date: new Date().toISOString().split("T")[0],
  };

  useEffect(() => {
    const loadCurrencies = async () => {
      setLoadingCurrencies(true);
      try {
        const data = await fetchCurrencies();
        setCurrencies(data);
      } catch (error) {
        console.error('Failed to load currencies:', error);
      } finally {
        setLoadingCurrencies(false);
      }
    };

    loadCurrencies();
  }, []);

  const {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    shouldShowError,
  } = useForm<TransactionFormData>(initialValues, validationRules, onSubmit);

  const availableCategories: readonly string[] =
    values.type === TransactionType.INCOME
      ? CATEGORIES.INCOME
      : CATEGORIES.EXPENSE;

  return (
    <form onSubmit={handleSubmit} className="transaction-form" noValidate>
      <h2>{initialData ? "Edit Transaction" : "Add New Transaction"}</h2>

      <div className="form-group">
        <label htmlFor="type">
          Type <span className="required">*</span>
        </label>

        <div className="radio-group">
          <label className="radio-label">
            <input
              type="radio"
              name="type"
              value={TransactionType.INCOME}
              checked={values.type === TransactionType.INCOME}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            Income
          </label>

          <label className="radio-label">
            <input
              type="radio"
              name="type"
              value={TransactionType.EXPENSE}
              checked={values.type === TransactionType.EXPENSE}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            Expense
          </label>
        </div>

        {shouldShowError("type") && (
          <span className="error-message" role="alert">
            {errors.type}
          </span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="amount">
          Amount <span className="required">*</span>
        </label>
        <input
          type="text"
          inputMode="decimal"
          id="amount"
          name="amount"
          value={values.amount}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="0.00"
          aria-invalid={shouldShowError("amount")}
          aria-describedby={
            shouldShowError("amount") ? "amount-error" : undefined
          }
        />
        {shouldShowError("amount") && (
          <span id="amount-error" className="error-message" role="alert">
            {errors.amount}
          </span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="category">
          Category <span className="required">*</span>
        </label>
        <select
          id="category"
          name="category"
          value={values.category}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-invalid={shouldShowError("category")}
          aria-describedby={
            shouldShowError("category") ? "category-error" : undefined
          }
        >
          <option value="">Select a category</option>
          {availableCategories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        {shouldShowError("category") && (
          <span id="category-error" className="error-message" role="alert">
            {errors.category}
          </span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="currency">
          Currency <span className="required">*</span>
        </label>
        <select
          id="currency"
          name="currency"
          value={values.currency}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={loadingCurrencies}
          aria-invalid={shouldShowError("currency")}
          aria-describedby={
            shouldShowError("currency") ? "currency-error" : undefined
          }
        >
          {loadingCurrencies ? (
            <option value="">Loading currencies...</option>
          ) : (
            <>
              <option value="">Select a currency</option>
              {currencies.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.code} - {currency.name}
                </option>
              ))}
            </>
          )}
        </select>
        {shouldShowError("currency") && (
          <span id="currency-error" className="error-message" role="alert">
            {errors.currency}
          </span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="date">
          Date <span className="required">*</span>
        </label>
        <input
          type="date"
          id="date"
          name="date"
          value={values.date}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-invalid={shouldShowError("date")}
          aria-describedby={shouldShowError("date") ? "date-error" : undefined}
        />
        {shouldShowError("date") && (
          <span id="date-error" className="error-message" role="alert">
            {errors.date}
          </span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="description">
          Description <span className="required">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          value={values.description}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Add a note about this transaction..."
          rows={3}
          maxLength={200}
          aria-invalid={shouldShowError("description")}
          aria-describedby={
            shouldShowError("description") ? "description-error" : undefined
          }
        />
        {shouldShowError("description") && (
          <span id="description-error" className="error-message" role="alert">
            {errors.description}
          </span>
        )}
        <small className="character-count">
          {values.description.length}/200 characters
        </small>
      </div>

      <div className="form-actions">
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-primary"
        >
          {isSubmitting
            ? "Saving..."
            : initialData
            ? "Update Transaction"
            : "Add Transaction"}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="btn btn-secondary"
          >
            Cancel
          </button>
        )}
      </div>

      {errors.submit && (
        <div className="form-error" role="alert">
          {errors.submit}
        </div>
      )}
    </form>
  );
};

export default TransactionForm;
