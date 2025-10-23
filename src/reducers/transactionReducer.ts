import { TransactionAction, TransactionState, ActionType } from "../types";

export const initialState: TransactionState = {
  transactions: [],
  loading: false,
  error: null,
};

export const transactionReducer = (
  state: TransactionState,
  action: TransactionAction
): TransactionState => {
  switch (action.type) {
    case ActionType.SET_TRANSACTIONS:
      return {
        ...state,
        transactions: action.payload,
        error: null,
        loading: false,
      };
    case ActionType.ADD_TRANSACTION:
      return {
        ...state,
        transactions: [action.payload, ...state.transactions],
        error: null,
      };
    case ActionType.DELETE_TRANSACTION:
      return {
        ...state,
        transactions: state.transactions.filter(
          (transaction) => transaction.id !== action.payload
        ),
        error: null,
      };
    case ActionType.UPDATE_TRANSACTION:
      return {
        ...state,
        transactions: state.transactions.map((transaction) =>
          transaction.id === action.payload.id
            ? { ...transaction, ...action.payload.updates }
            : transaction
        ),
        error: null,
      };
    case ActionType.SET_LOADING:
      return { ...state, loading: action.payload };
    case ActionType.SET_ERROR:
      return { ...state, error: action.payload };

    default:
      // This will cause a compile error if we miss any case in the action type switch statement
      // Can be removed but just to be safe.
      const exhaustiveCheck: never = action;
      return state;
  }
};
