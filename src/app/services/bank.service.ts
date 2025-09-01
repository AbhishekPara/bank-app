import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Account, AccountType } from '../models/account';
import { Transaction } from '../models/transaction';

@Injectable({ providedIn: 'root' })
export class BankService {
  private accounts$ = new BehaviorSubject<Account[]>([]);
  private transactions$ = new BehaviorSubject<Transaction[]>([]);

  private nextAccountId = 1;
  private nextTxnId = 1;

  getAccountsStream() {
    return this.accounts$.asObservable();
  }
  getAccountsSnapshot(): Account[] {
    return this.accounts$.getValue();
  }
  getAccountSnapshot(id: number): Account | undefined {
    return this.getAccountsSnapshot().find(a => a.id === id);
  }

  createAccount(name: string, type: AccountType, initialBalance: number) {
    if (initialBalance < 0) throw new Error('Initial balance cannot be negative.');
    const acct: Account = {
      id: this.nextAccountId++,
      name: name.trim(),
      type,
      balance: +initialBalance,
    };
    this.accounts$.next([...this.getAccountsSnapshot(), acct]);
    return acct.id;
  }

  getTransactionsStream() {
    return this.transactions$.asObservable();
  }
  getTransactionsSnapshot() {
    return this.transactions$.getValue();
  }
  getTransactionsForAccount(id: number): Transaction[] {
    return this.getTransactionsSnapshot().filter(t => t.fromAccountId === id || t.toAccountId === id);
  }

  transferFunds(fromId: number, toId: number, amount: number, note?: string) {
    if (fromId === toId) throw new Error('From and To accounts must be different.');
    if (amount <= 0) throw new Error('Amount must be greater than 0.');

    const accounts = [...this.getAccountsSnapshot()];
    const from = accounts.find(a => a.id === fromId);
    const to = accounts.find(a => a.id === toId);
    if (!from || !to) throw new Error('Account not found.');
    if (from.balance < amount) throw new Error('Insufficient funds.');

    from.balance = +(from.balance - amount).toFixed(2);
    to.balance   = +(to.balance + amount).toFixed(2);

    this.accounts$.next(accounts);

    const txn: Transaction = {
      id: this.nextTxnId++,
      date: new Date().toISOString(),
      fromAccountId: fromId,
      toAccountId: toId,
      amount: +amount,
      note: note?.trim() || undefined,
    };
    this.transactions$.next([...this.getTransactionsSnapshot(), txn]);
    return txn.id;
  }
}
