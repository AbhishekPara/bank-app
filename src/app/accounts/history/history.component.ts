import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { BankService } from '../../services/bank.service';
import { Account } from '../../models/account';
import { Transaction } from '../../models/transaction';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './history.component.html',
})
export class HistoryComponent implements OnInit, OnDestroy {
  accounts: Account[] = [];
  selectedAccountId: number | null = null;
  allTxns: Transaction[] = [];
  filtered: Transaction[] = [];
  q = '';

  subs: Subscription[] = [];

  constructor(private bank: BankService) {}

  ngOnInit() {
    this.subs.push(
      this.bank.getAccountsStream().subscribe(a => {
        this.accounts = a;
        if (!this.selectedAccountId && a.length) {
          this.selectedAccountId = a[0].id;
          this.apply();
        }
      }),
      this.bank.getTransactionsStream().subscribe(t => {
        this.allTxns = t;
        this.apply();
      })
    );
  }

  ngOnDestroy() { this.subs.forEach(s => s.unsubscribe()); }

  apply() {
    if (!this.selectedAccountId) { this.filtered = []; return; }
    const base = this.bank.getTransactionsForAccount(this.selectedAccountId);
    const q = this.q.trim().toLowerCase();
    this.filtered = q
      ? base.filter(t =>
          (t.note?.toLowerCase().includes(q) ?? false) ||
          String(t.amount).includes(q) ||
          String(t.id).includes(q))
      : base;
    this.filtered = [...this.filtered].sort((a, b) => b.id - a.id);
  }

  direction(t: Transaction) {
    return (t.fromAccountId === this.selectedAccountId) ? 'Sent' : 'Received';
  }

  counterparty(t: Transaction): string {
    const id = t.fromAccountId === this.selectedAccountId ? t.toAccountId : t.fromAccountId;
    const acct = this.bank.getAccountSnapshot(id);
    return acct ? `#${acct.id} • ${acct.name}` : `#${id}`;
  }
}
