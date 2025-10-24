import { useCallback, useReducer, useEffect } from "react";
import {
  transactionReducer,
  initialState,
} from "../reducers/transactionReducer";
import {
  ActionType,
  TransactionFormData,
  ApiResponse,
  Transaction,
  UseTransactionsReturn,
} from "../types";
import * as api from "../services/api";

export const useTransactions = (): UseTransactionsReturn => {
  const [state, dispatch] = useReducer(transactionReducer, initialState);

  useEffect(() => {
    const fetchTransactions = async (): Promise<void> => {
      dispatch({ type: ActionType.SET_LOADING, payload: true });

      try {
        const transactions = await api.fetchTransactions();
        dispatch({ type: ActionType.SET_TRANSACTIONS, payload: transactions });
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unknown error";
        dispatch({ type: ActionType.SET_ERROR, payload: message });
      }
    };

    fetchTransactions();
  }, []);

  const addTransaction = useCallback(
    async (data: TransactionFormData): Promise<ApiResponse<Transaction>> => {
      dispatch({ type: ActionType.SET_LOADING, payload: true });

      try {
        const transaction = await api.createTransaction(data);
        dispatch({ type: ActionType.ADD_TRANSACTION, payload: transaction });
        return { success: true, data: transaction };
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unknown error";
        dispatch({ type: ActionType.SET_ERROR, payload: message });
        return { success: false, error: message };
      } finally {
        dispatch({ type: ActionType.SET_LOADING, payload: false });
      }
    },
    []
  );

  const deleteTransaction = useCallback(
    async (id: string): Promise<ApiResponse<null>> => {
      dispatch({ type: ActionType.SET_LOADING, payload: true });

      try {
        await api.deleteTransaction(id);
        dispatch({ type: ActionType.DELETE_TRANSACTION, payload: id });
        return { success: true };
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unknown error";
        dispatch({ type: ActionType.SET_ERROR, payload: message });
        return { success: false, error: message };
      }
    },
    []
  );

  const updateTransaction = useCallback(
    async (
      id: string,
      updates: Partial<Transaction>
    ): Promise<ApiResponse<Transaction>> => {
      dispatch({ type: ActionType.SET_LOADING, payload: true });

      try {
        const updated = await api.updateTransaction(id, updates);
        dispatch({
          type: ActionType.UPDATE_TRANSACTION,
          payload: { id, updates },
        });
        return { success: true, data: updated };
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unknown error";
        dispatch({ type: ActionType.SET_ERROR, payload: message });
        return { success: false, error: message };
      }
    },
    []
  );

  const clearError = useCallback((): void => {
    dispatch({ type: ActionType.SET_ERROR, payload: null });
  }, []);

  return {
    transactions: state.transactions,
    isLoading: state.loading,
    error: state.error,
    addTransaction,
    deleteTransaction,
    updateTransaction,
    clearError,
  };
};
