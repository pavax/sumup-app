import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {environment} from "../../environments/environment";

export const SUMUP_BASE_URL = "https://api.sumup.com/v0.1";


@Injectable({
  providedIn: 'root'
})
export class TransactionsApiService {

  constructor(private httpClient: HttpClient) {
  }

  public loadTransactionDetail(id: string): Observable<TransactionDetail> {
    return this.httpClient.get<TransactionDetail>(`${SUMUP_BASE_URL}/me/transactions`, {
      params: new HttpParams()
        .append("id", id)
    });
  }

  public listTransactions(dateFrom?: string, dateTo?: string, statuses: string[] = [], newest_ref?: string, limit: number = environment.pageLimit): Observable<Transaction[]> {
    let params = new HttpParams()
      .append("limit", limit)
      .append("order", 'descending');

    if (!!dateTo) {
      params = params.append("newest_time", dateTo)
    }

    if (!!dateFrom) {
      params = params.append("oldest_time", dateFrom)
    }

    statuses.forEach(value => {
      params = params.append("statuses[]", value);
    })
    if (!!newest_ref) {
      params = params.append("newest_ref", newest_ref)
    }
    return this.httpClient.get<Response<Transaction>>(`${SUMUP_BASE_URL}/me/transactions/history`, {params})
      .pipe(map(value => value.items));
  }

  public listPayouts(dateFrom: string, dateTo: string): Observable<Payout[]> {
    return this.httpClient.get<Response<Payout>>(`${SUMUP_BASE_URL}/me/financials/payouts`, {
      params: new HttpParams()
        .append("start_date", dateFrom)
        .append("end_date", dateTo)
    }).pipe(map(value => value.items));
  }
}

export interface TransactionDetail {
  id: string;
  transaction_code: string;
  amount: number;
  vat_amount: number;
  tip_amount: number;

  timestamp: number;

  status: TransactionDetailStatus;

  currency: string;
  payouts_received: number;
  events?: Event[]
  links: Link[];
}

export enum LinkType {
  RECEIPT = 'receipt'
}

export interface Link {
  rel: LinkType;
  href: string;
  type: string;
}

export interface Event {
  type: EventType;
  amount: number;
  status: EventStatus;
  timestamp: string;
}

export interface PayoutEvent extends Event {
  fee_amount: number;
  deducted_amount: number;
  deducted_fee_amount: number;
  payout_reference: string;
}

export interface RefundEvent extends Event {

}

export interface PayoutDeductionEvent extends Event {
  paid_for: string;
  fee_amount: number;
}


export enum TransactionType {
  PAYMENT = 'PAYMENT',
  REFUND = 'REFUND',
}


export enum EventType {
  PAYOUT = 'PAYOUT',
  REFUND = 'REFUND',
  PAYOUT_DEDUCTION = 'PAYOUT_DEDUCTION'
}


export enum EventStatus {
  PAID_OUT = 'PAID_OUT',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
  PENDING = 'PENDING',
  SCHEDULED = 'SCHEDULED'
}

export enum TransactionDetailStatus {
  SUCCESSFUL = 'SUCCESSFUL',
  FAILED = 'FAILED'
}

export enum TransactionStatus {
  SUCCESSFUL = 'SUCCESSFUL',
  REFUNDED = 'REFUNDED',
  FAILED = 'FAILED'
}


export interface Response<T> {
  items: T[]
}

export interface Transaction {
  id: string;
  transaction_id: string;
  transaction_code: string;
  type: TransactionType;
  status: TransactionStatus;
  timestamp: string;
  amount: number
}

export interface Payout {
  amount: number;
  currency: string;
  date: string;
  fee: number;
  id: number;
  reference: string;
  status: string;
  transaction_code: string;
  type: string;
}
