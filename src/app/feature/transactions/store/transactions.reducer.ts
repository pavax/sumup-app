import {createReducer, on} from '@ngrx/store';
import * as TransactionsActions from './transactions.actions';
import {Transaction, TransactionDetail} from "../../../core/transactions-api.service";

export const transactionsFeatureKey = 'transactions';

export interface State {
  transactions: Transaction[];
  transactionDetails: TransactionDetail[];
  loading: boolean;
  isLoadingMore: boolean,
  filter?: {
    dateFrom?: string;
    dateTo?: string;
    statuses: string[]
  },
  allTransactionsLoaded: boolean;
}

export const initialState: State = {
  transactions: [],
  transactionDetails: [],
  loading: false,
  isLoadingMore: false,
  filter: undefined,
  allTransactionsLoaded: false
};

export const reducer = createReducer(
  initialState,

  on(TransactionsActions.fetchTransactions, (state, action) => ({
    ...state,
    loading: true,
    filter: {
      dateFrom: action.dateFrom,
      dateTo: action.dateTo,
      statuses: action.statuses,
    }
  })),
  on(TransactionsActions.fetchTransactionsSuccess, (state, action) => ({
    ...state,
    transactions: [...action.data],
    transactionDetails: [],
    allTransactionsLoaded: false
  })),
  on(TransactionsActions.fetchTransactionsFailure, (state) => ({
    ...state,
    loading: false
  })),

  on(TransactionsActions.loadMoreTransactions, (state) => ({
    ...state,
    isLoadingMore: true
  })),
  on(TransactionsActions.loadMoreTransactionsSuccess, (state, action) => ({
    ...state,
    transactions: [...state.transactions, ...action.data],
    isLoadingMore: false
  })),
  on(TransactionsActions.loadMoreTransactionsFailure, (state, action) => ({
    ...state,
    isLoadingMore: false
  })),
  on(TransactionsActions.fetchTransactionDetails, (state, action) => ({
    ...state,
    loading: true,
    isLoadingMore: true,
  })),
  on(TransactionsActions.fetchTransactionDetailsSuccess, (state, action) => ({
    ...state,
    transactionDetails: [...state.transactionDetails, ...action.data],
    loading: false,
    isLoadingMore: false,
  })),
  on(TransactionsActions.fetchTransactionDetailsFailure, (state) => ({
    ...state,
    loading: false,
    isLoadingMore: false,
  })),
  on(TransactionsActions.allTransactionsLoaded, (state) => ({
    ...state,
    allTransactionsLoaded: true
  })),
  on(TransactionsActions.notAllTranscationsLoaded, (state) => ({
    ...state,
    allTransactionsLoaded: false
  })),
);
