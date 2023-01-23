import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, map, switchMap, withLatestFrom} from 'rxjs/operators';
import {debounceTime, forkJoin, of} from 'rxjs';
import * as TransactionsActions from './transactions.actions';
import * as TransactionSelector from './transactions.selectors';
import {TransactionsApiService} from "../../../core/transactions-api.service";
import {Store} from "@ngrx/store";
import {ErrorHandler} from "../../../core/errorHandler";


@Injectable()
export class TransactionsEffects {

  fetchTransactions$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TransactionsActions.fetchTransactions),
      debounceTime(500),
      switchMap(action =>
        this.transactionsApiService.listTransactions(action.dateFrom, action.dateTo, action.statuses || []).pipe(
          map(response => TransactionsActions.fetchTransactionsSuccess({data: response})),
          catchError(error => of(TransactionsActions.fetchTransactionsFailure({error})))
        ))
    );
  });

  allTransactionsLoaded$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TransactionsActions.loadMoreTransactionsSuccess),
      map((action) => {
        if (action.data.length === 0) {
          return TransactionsActions.allTransactionsLoaded();
        }
        return TransactionsActions.notAllTranscationsLoaded();
      })
    );
  });

  loadMoreTransactions$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TransactionsActions.loadMoreTransactions),
      withLatestFrom(this.store.select(TransactionSelector.selectCurrentFilter), this.store.select(TransactionSelector.selectOldestTx)),
      switchMap(([_, filter, oldestTx]) => {
        return this.transactionsApiService.listTransactions(filter!.dateFrom, filter!.dateTo, filter!.statuses, oldestTx.transaction_id).pipe(
          map(response => TransactionsActions.loadMoreTransactionsSuccess({data: response})),
          catchError(error => of(TransactionsActions.loadMoreTransactionsFailure({error})))
        );
      })
    );
  });

  dispatchFetchTransactionDetails$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        TransactionsActions.fetchTransactionsSuccess,
        TransactionsActions.loadMoreTransactionsSuccess),
      map(action => {
          let ids = action.data.map((r) => r.transaction_id);
          if (action.type === TransactionsActions.fetchTransactionsSuccess.type) {
            return TransactionsActions.fetchTransactionDetails({transactionIds: ids, trigger: 'FILTER'})
          }
          return TransactionsActions.fetchTransactionDetails({transactionIds: ids, trigger: 'LOAD_MORE'})
        }
      ))
  });
  fetchTransactionsDetails$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TransactionsActions.fetchTransactionDetails),
      switchMap(action => {
        const transactionIds = action.transactionIds;
        if (transactionIds.length === 0) {
          return of(TransactionsActions.fetchTransactionDetailsSuccess({data: []}));
        }
        return forkJoin(transactionIds.map((id) => this.transactionsApiService.loadTransactionDetail(id))).pipe(
          map(response => TransactionsActions.fetchTransactionDetailsSuccess({data: response})),
          catchError(error => of(TransactionsActions.fetchTransactionDetailsFailure({error})))
        );
      })
    );
  });
  handleErrors$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        TransactionsActions.fetchTransactionDetailsFailure,
        TransactionsActions.fetchTransactionsFailure,
        TransactionsActions.loadMoreTransactionsFailure,
      ),
      map(action => {
        this.errorHandler.handle(action.error);
      })
    );
  }, {dispatch: false})

  constructor(private actions$: Actions, private transactionsApiService: TransactionsApiService, private store: Store, private readonly errorHandler: ErrorHandler) {
  }
}
