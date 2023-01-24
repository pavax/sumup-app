import {Component, Inject} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Store} from "@ngrx/store";
import {TransactionViewModel} from "../../store/transactions.selectors";
import {
  Event,
  EventStatus,
  EventType,
  PayoutDeductionEvent,
  PayoutEvent
} from "../../../../core/transactions-api.service";


@Component({
  templateUrl: 'transaction-details.dialog.component.html',
  styleUrls: ['transaction-details.dialog.component.less']
})
export class TransactionDetailsDialogComponent {

  selectedTransaction: TransactionViewModel;

  entries: TransactionHistoryEntry[];

  constructor(
    private dialogRef: MatDialogRef<TransactionDetailsDialogComponent>,
    private store: Store,
    @Inject(MAT_DIALOG_DATA) private data: any) {
    this.selectedTransaction = data;

    this.entries = [
      this.createFirstEntry(this.selectedTransaction),
      ...this.convertEvents(this.selectedTransaction.events)
    ].sort((a, b) => b.timestamp - a.timestamp);

  }

  private createFirstEntry(transactionViewModel: TransactionViewModel) {
    if (!transactionViewModel.failed) {
      return {
        title: 'Bezahlung',
        icon: 'start',
        amount: transactionViewModel.origAmount,
        timestamp: new Date(transactionViewModel.origTransactionTimestamp).getTime(),
        status: 'success',
      };
    } else {
      return {
        title: 'Fehlgeschlagen',
        icon: 'cancel',
        amount: transactionViewModel.origAmount,
        timestamp: new Date(transactionViewModel.origTransactionTimestamp).getTime(),
        status: 'default',
      };
    }
  }

  private convertEvents(events: Event[]) {
    return events
      .map(event => {
        let result: TransactionHistoryEntry = {
          amount: event.amount,
          timestamp: new Date(event.timestamp).getTime(),
          icon: '',
          status: 'default',
          title: '',
        };
        if (event.type === EventType.REFUND) {
          result.title = "Rückerstattung";
          result.amount = 0 - result.amount;
          result.status = 'error';
          result.icon = 'arrow_circle_left';
        } else if (event.type === EventType.PAYOUT_DEDUCTION) {
          const payoutDeductionEvent = event as PayoutDeductionEvent;
          result.title = "Zahlung abgezogen";
          result.status = 'error';
          result.amount = 0 - result.amount;
          result.icon = 'arrow_circle_left';
          result.text = `Dieser Betrag wurde abgezogen, um eine frühere Rückerstattung von ${payoutDeductionEvent.paid_for} abzudecken.`
        } else if (event.type === EventType.PAYOUT && event.status === EventStatus.CANCELLED) {
          result.title = "Auszahlung abgebrochen";
          result.icon = 'error';
          result.amount = 0;
          result.text = "Komplette Rückerstattung";
        } else if (event.type === EventType.PAYOUT && event.status === EventStatus.SCHEDULED) {
          result.title = "Ausstehende Auszahlung";
          result.icon = 'schedule';
        } else if (event.type === EventType.PAYOUT && event.status === EventStatus.PAID_OUT) {
          const payoutEvent = event as PayoutEvent;
          result.title = `Ausgezahlt`;
          result.status = 'success';
          result.icon = 'paid';
          result.text = `${payoutEvent.payout_reference} | Gebühr: ${payoutEvent.fee_amount}`
        }
        return result
      });
  }
}

export interface TransactionHistoryEntry {
  icon: string;
  status: string;
  amount: number;
  title: string;
  timestamp: number;
  text?: string;

}
