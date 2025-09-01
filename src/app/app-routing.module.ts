import { Routes } from '@angular/router';
import { AccountCreateComponent } from './accounts/account-create/account-create.component';
import { TransferComponent } from './accounts/transfer/transfer.component';
import { HistoryComponent } from './accounts/history/history.component';

export const routes: Routes = [
  { path: '', redirectTo: 'create', pathMatch: 'full' },
  { path: 'create', component: AccountCreateComponent },
  { path: 'transfer', component: TransferComponent },
  { path: 'history', component: HistoryComponent },
  { path: '**', redirectTo: 'create' },
];
