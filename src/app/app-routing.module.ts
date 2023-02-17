import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardWithForcedLogin } from './core/auth-guard-with-forced-login.service';
import { LoginComponent } from './core/components/login/login.component';

const routes: Routes = [
  { path: '', redirectTo: '/transactions', pathMatch: 'full' },
  {
    path: '',
    loadChildren: () =>
      import('./feature/transactions/transactions.module').then(
        m => m.TransactionsModule
      ),
    canActivate: [AuthGuardWithForcedLogin],
  },
  {
    path: 'login',
    component: LoginComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
