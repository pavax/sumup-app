import {createAction, props} from '@ngrx/store';
import {Payout, Transaction, TransactionDetail} from "../../../core/transactions-api.service";

export const fetchTransactions = createAction(
  '[Transactions] Load Transactions',
  props<{ dateFrom?: string, dateTo?: string, statuses: string[] }>()
);

export const loadMoreTransactions = createAction(
  '[Transactions] Load More Transactions'
);

export const loadMoreTransactionsSuccess = createAction(
  '[Transactions] Load More Transactions Success',
  props<{ data: Transaction[] }>()
);

export const allTransactionsLoaded = createAction(
  '[Transactions] All Transactions Loaded'
);

export const notAllTranscationsLoaded = createAction(
  '[Transactions] Not All Transactions Loaded'
);

export const loadMoreTransactionsFailure = createAction(
  '[Transactions] Load Transactions Failure',
  props<{ error: any }>()
);

export const fetchTransactionsSuccess = createAction(
  '[Transactions] Load Transactions Success',
  props<{ data: Transaction[] }>()
);

export const fetchTransactionsFailure = createAction(
  '[Transactions] Load Transactions Failure',
  props<{ error: any }>()
);

export const fetchTransactionDetails = createAction(
  '[Transactions] Load Transaction Details',
  props<{ transactionIds: string[], trigger: 'FILTER' | 'LOAD_MORE' }>()
);

export const fetchTransactionDetailsSuccess = createAction(
  '[Transactions] Load Transaction Details Success',
  props<{ data: TransactionDetail[], }>()
);

export const fetchTransactionDetailsFailure = createAction(
  '[Transactions] Load Transaction Details Failure',
  props<{ error: any }>()
);
