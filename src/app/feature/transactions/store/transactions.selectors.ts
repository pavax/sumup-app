import {createFeatureSelector, createSelector} from '@ngrx/store';
import * as fromTransactions from './transactions.reducer';
import {
  Event,
  EventStatus,
  EventType,
  LinkType,
  PayoutEvent,
  Transaction,
  TransactionDetail,
  TransactionStatus,
  TransactionType
} from "../../../core/transactions-api.service";

export const selectTransactionsState = createFeatureSelector<fromTransactions.State>(
  fromTransactions.transactionsFeatureKey
);
export const selectIsLoading = createSelector(selectTransactionsState, state => {
  return state.loading;
})

export const selectIsLoadingMore = createSelector(selectTransactionsState, state => {
  return state.isLoadingMore;
})
export const selectAllTransactionsLoaded = createSelector(selectTransactionsState, state => {
  return state.allTransactionsLoaded;
})
export const selectTransactions = createSelector(selectTransactionsState, state => {
  return state.transactions;
})

export const selectCurrentFilter = createSelector(selectTransactionsState, state => {
  return state.filter;
})

export const selectOldestTx = createSelector(selectTransactions, transactions => {
  return transactions[transactions.length - 1];
})

export const selectTransactionsDetailsMap = createSelector(selectTransactionsState, state => {
  const groupedById: Map<string, TransactionDetail> = state.transactionDetails.reduce(
    (entryMap, e) => entryMap.set(e.id, e),
    new Map()
  );
  return groupedById;
})


function convertToTransactionViewModel(transactions: Transaction[], details: Map<string, TransactionDetail>): TransactionViewModel[] {
  return transactions
    .filter(value => !!details.get(value.transaction_id))
    .map(transaction => {
      let transactionDetails = details.get(transaction.transaction_id);
      if (!transactionDetails) {
        throw new Error("Tx not found");
      }
      const date = new Date(transaction.timestamp);

      const isRefundTx = transaction.type === TransactionType.REFUND;

      const payoutPaidEvents = (transactionDetails.events || [])
        .filter(value => value.type === EventType.PAYOUT)
        .filter(value => value.status === EventStatus.PAID_OUT) as PayoutEvent[];

      let status = '';
      let icon = '';
      if (transaction.status === TransactionStatus.FAILED) {
        status = 'Fehlgeschlagen';
        icon = 'cancel';
      } else if (transaction.status === TransactionStatus.REFUNDED) {
        status = 'Rückerstattung';
        icon = 'arrow_circle_left';
      } else if (payoutPaidEvents.length) {
        status = 'Ausgezahlt';
        icon = 'paid';
      } else if (transaction.status === TransactionStatus.SUCCESSFUL) {
        status = 'Erfolgreich';
        icon = 'check_circle';
      } else {
        status = 'Unbekannt';
        icon = '';
      }

      return {
        id: transaction.id,
        transaction_code: transaction.transaction_code,
        statusText: status,
        timestamp: date.getTime(),
        origTransactionTimestamp: transactionDetails.timestamp,
        events: transactionDetails.events || [],
        isRefund: isRefundTx,
        failed: transaction.status === TransactionStatus.FAILED,
        icon: icon,
        amount: isRefundTx ? 0 - transaction.amount : transaction.amount,
        tip_amount: isRefundTx ? 0 : transactionDetails.tip_amount,
        payout_amount: isRefundTx ? 0 : payoutPaidEvents
          .map(value => value.amount)
          .reduce(sum(), 0),
        payout_feeAmount: isRefundTx ? 0 : payoutPaidEvents
          .map(value => value.fee_amount)
          .reduce(sum(), 0),
        receiptUrl: transactionDetails.links
          .filter(value => value.rel === LinkType.RECEIPT)
          .filter(value => value.type === "image/png")
          .map(value => value.href)
          .find(value => !!value),
      };
    });
}

export const selectNewViewModel = createSelector(selectTransactions, selectTransactionsDetailsMap, selectIsLoading, selectIsLoadingMore, selectAllTransactionsLoaded,
  (transactions, details, loading, isLoadingMore, allTransactionsLoaded) => {
    const transactionViewModels = convertToTransactionViewModel(transactions, details)
    //.sort((a, b) => a.timestamp - b.timestamp).reverse();
    const results = toDayEntries(transactionViewModels);

    let timestamps = transactionViewModels.map(value => value.timestamp);
    return {
      transactions: results,
      totalAmount: transactionViewModels
        .filter(value => !value.failed)
        .map(value => value.amount)
        .reduce(sum(), 0),
      totalTip: transactionViewModels
        .filter(value => !value.failed)
        .map(value => value.tip_amount)
        .reduce(sum(), 0),
      totalPayout: transactionViewModels
        .filter(value => !value.failed)
        .map(value => value.payout_amount || 0)
        .reduce(sum(), 0),
      totalFeeAmount: transactionViewModels
        .filter(value => !value.failed)
        .map(value => value.payout_feeAmount || 0)
        .reduce(sum(), 0),
      isLoading: loading,
      allTransactionsLoaded: allTransactionsLoaded,
      isLoadingMore: isLoadingMore,
      minTimestamp: timestamps.length ? Math.min(...timestamps) : undefined,
      maxTimestamp: timestamps.length ? Math.max(...timestamps) : undefined,
    }
  });

function sum(subtract: boolean = false): (sum: number, a: number) => number {
  if (subtract) {
    return (sum: number, a: number) => sum - a;
  } else {
    return (sum: number, a: number) => sum + a;
  }
}

function toDayEntries(transactionViewModels: TransactionViewModel[]) {
  const groupedByDate: Map<number, TransactionViewModel[]> = transactionViewModels.reduce(
    (entryMap, e) => {
      const dayTimestamp = new Date(e.timestamp).setHours(0, 0, 0, 0);
      return entryMap.set(dayTimestamp, [...entryMap.get(dayTimestamp) || [], e]);
    },
    new Map()
  );

  const results: DayEntry[] = [];

  groupedByDate.forEach((value, key) => {
    results.push({
      day: key,
      transactions: value,
      totalAmount: value
        .filter(value => !value.failed)
        .map(value1 => value1.amount)
        .reduce((partialSum, a) => partialSum + a, 0),
    })
  })
  return results;
}


export interface DayEntry {
  day: number,
  totalAmount: number;
  transactions: TransactionViewModel[];
}

export interface TransactionViewModel {
  id: string;
  icon: string;
  transaction_code: string;
  amount: number;
  tip_amount: number;
  payout_amount?: number;
  payout_feeAmount?: number;
  timestamp: number;
  origTransactionTimestamp: number;
  statusText: string;
  failed: boolean;
  isRefund: boolean;
  receiptUrl?: string;
  events: Event[];

}
