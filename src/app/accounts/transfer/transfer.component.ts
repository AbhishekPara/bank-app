import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, Validators, ValidatorFn, AbstractControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { BankService } from '../../services/bank.service';
import { Account } from '../../models/account';

function differentAccountsValidator(group: AbstractControl) {
  const from = group.get('fromAccountId')?.value;
  const to = group.get('toAccountId')?.value;
  return (from && to && +from === +to) ? { sameAccount: true } : null;
}

function sufficientFundsValidator(bank: BankService): ValidatorFn {
  return (group: AbstractControl) => {
    const amount = +group.get('amount')?.value || 0;
    const fromId = +group.get('fromAccountId')?.value || 0;
    if (fromId && amount > 0) {
      const from = bank.getAccountSnapshot(fromId);
      if (from && amount > from.balance) return { insufficientFunds: true };
    }
    return null;
  };
}

@Component({
  selector: 'app-transfer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './transfer.component.html',
})
export class TransferComponent implements OnInit, OnDestroy {
  accounts: Account[] = [];
  sub?: Subscription;

  form: FormGroup;
  selectedFromId: number | null = null;
  selectedToId: number | null = null;

  msg = '';
  err = '';

  constructor(private fb: FormBuilder, private bank: BankService) {
    this.form = this.fb.group({
      fromAccountId: [null, [Validators.required]],
      toAccountId:   [null, [Validators.required]],
      amount:        [null, [Validators.required, Validators.min(0.01)]],
      note:          [''],
    }, { validators: [differentAccountsValidator, sufficientFundsValidator(this.bank)] });
  }

  ngOnInit() {
    this.sub = this.bank.getAccountsStream().subscribe(a => this.accounts = a);

    this.form.get('fromAccountId')?.valueChanges
      .subscribe((v: number | null) => this.selectedFromId = v ?? null);
    this.form.get('toAccountId')?.valueChanges
      .subscribe((v: number | null) => this.selectedToId = v ?? null);
  }

  ngOnDestroy() { this.sub?.unsubscribe(); }

  submit() {
    this.msg = this.err = '';
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const { fromAccountId, toAccountId, amount, note } = this.form.getRawValue();
    try {
      this.bank.transferFunds(+(fromAccountId!), +(toAccountId!), +(amount!), note!);
      this.msg = 'Transfer completed.';
      this.form.get('amount')?.reset();
      this.form.get('note')?.reset();
    } catch (e: any) {
      this.err = e?.message ?? 'Transfer failed.';
    }
  }

  balanceOf(id: number | null): number | null {
    if (!id) return null;
    return this.bank.getAccountSnapshot(id)?.balance ?? null;
  }
}
