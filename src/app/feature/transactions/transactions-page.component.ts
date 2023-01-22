import {Component, OnDestroy, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {State} from "./store/transactions.reducer";
import * as TransactionsActions from "./store/transactions.actions";
import * as TransactionsSelectors from "./store/transactions.selectors";
import {selectAllTransactionsLoaded, TransactionViewModel} from "./store/transactions.selectors";
import {FormBuilder, FormControl, FormGroupDirective, NgForm, Validators} from "@angular/forms";
import {debounceTime, Subject, takeUntil} from "rxjs";
import {TransactionStatus} from "../../core/transactions-api.service";
import {ErrorStateMatcher} from "@angular/material/core";
import {filter} from "rxjs/operators";
import {MatSnackBar} from "@angular/material/snack-bar";


class CrossFieldErrorMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    return control!.dirty && !!form?.invalid ? form.invalid : false;
  }
}

@Component({
  selector: 'app-transactions-page',
  templateUrl: './transactions-page.component.html',
  styleUrls: ['./transactions-page.component.less']
})
export class TransactionsPageComponent implements OnInit, OnDestroy {
  errorMatcher = new CrossFieldErrorMatcher();

  filterForm = this.fb.group({
    start: this.fb.control<Date | null>(null),
    end: this.fb.control<Date | null>(null),
    statuses: this.fb.control<string[]>([], Validators.required)
  });

  statusList: { key: string, label: string } [] = [
    {key: 'SUCCESSFUL', label: 'Erfolgreich'},
    {key: 'FAILED', label: 'Fehlgeschlagen'},
  ];

  viewModel$ = this.store.select(TransactionsSelectors.selectNewViewModel);


  private destroy$ = new Subject();

  public constructor(private store: Store<State>, private fb: FormBuilder, private snackBar: MatSnackBar) {
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  ngOnInit(): void {
    this.filterForm.valueChanges.pipe(
      debounceTime(200),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.onSubmit();
    });

    this.store.select(TransactionsSelectors.selectAllTransactionsLoaded).pipe(
      filter(value => value),
      takeUntil(this.destroy$)
    ).subscribe(value => {
      this.snackBar.open("Keinen weiteren Transaktionen mehr", undefined, {duration: 5000});
    })

    /*
        this.filterForm.addValidators(control => {
          let start = control.value.start;
          let end = control.value.end;
          if (!start && !end) {
            return {'startXorEndNeeded': true}
          }
          return null;
        })
    */

    // this.filterForm.controls.start.setValue(pastDate);
    //this.filterForm.controls.end.setValue(new Date());
    this.filterForm.controls.statuses.setValue([TransactionStatus.SUCCESSFUL]);
  }

  onSubmit() {
    if (!this.filterForm.valid) {
      this.filterForm.markAsTouched();
      return;
    }
    this.store.dispatch(TransactionsActions.fetchTransactions({
      dateFrom: this.filterForm.value.start?.toISOString(),
      dateTo: this.prepareEndDate()?.toISOString(),
      statuses: this.filterForm.value.statuses || [],
    }));
  }

  private prepareEndDate(): Date | undefined {
    if (!this.filterForm.value.end) {
      return undefined;
    }
    const endDate = new Date(this.filterForm.value.end!)
    endDate.setHours(24, 0, 0, 0);
    return endDate;
  }

  loadMore() {
    this.store.dispatch(TransactionsActions.loadMoreTransactions());
  }

  identify(index: number, item: TransactionViewModel) {
    return item.id;
  }

  clearDateRange() {
    this.filterForm.controls.start.setValue(null);
    this.filterForm.controls.end.setValue(null);
  }
}
