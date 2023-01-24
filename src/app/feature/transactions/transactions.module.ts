import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StoreModule} from '@ngrx/store';
import * as fromTransactions from './store/transactions.reducer';
import {EffectsModule} from '@ngrx/effects';
import {TransactionsEffects} from './store/transactions.effects';
import {TransactionsPageComponent} from './transactions-page.component';
import {HttpClientModule} from "@angular/common/http";
import {RouterModule} from "@angular/router";
import {MatFormFieldModule} from "@angular/material/form-field";

import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatRadioModule} from '@angular/material/radio';
import {MatCardModule} from '@angular/material/card';
import {MatTableModule} from "@angular/material/table";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatListModule} from "@angular/material/list";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import {MatExpansionModule} from "@angular/material/expansion";
import {ScrollingModule} from "@angular/cdk/scrolling";
import {SharedModule} from "../../shared/shared.module";
import {ExamplePageComponent} from "./components/example/example-page.component";
import {TransactionDetailsDialogComponent} from "./components/transaction-details/transaction-details.dialog.component";
import {MatDialogModule} from "@angular/material/dialog";
import {MatTooltipModule} from "@angular/material/tooltip";

@NgModule({
  declarations: [
    TransactionsPageComponent,
    ExamplePageComponent,
    TransactionDetailsDialogComponent

  ],
  imports: [
    CommonModule,
    SharedModule,
    HttpClientModule,
    RouterModule.forChild([
      {path: '', redirectTo: 'transactions', pathMatch: 'full'},
      {path: 'transactions', component: TransactionsPageComponent},
      {path: 'example', component: ExamplePageComponent},
    ]),
    StoreModule.forFeature(fromTransactions.transactionsFeatureKey, fromTransactions.reducer),
    EffectsModule.forFeature([TransactionsEffects]),
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatCardModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatListModule,
    MatToolbarModule,
    MatIconModule,
    MatExpansionModule,
    ScrollingModule,
    MatDialogModule,
    MatTooltipModule
  ],
})
export class TransactionsModule {
}
