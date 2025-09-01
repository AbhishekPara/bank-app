import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { BankService } from '../../services/bank.service';
import { AccountType } from '../../models/account';
import { TypeButtonComponent } from '../../shared/type-button/type-button.component';

@Component({
  selector: 'app-account-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TypeButtonComponent],
  templateUrl: './account-create.component.html',
})
export class AccountCreateComponent {
  form: FormGroup;
  createdId: number | null = null;
  errorMsg = '';

  constructor(private fb: FormBuilder, private bank: BankService) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
      type: ['chequing' as AccountType, [Validators.required]],
      initialBalance: [0, [Validators.required, Validators.min(0)]],
    });
  }

  get type(): AccountType | null {
    return this.form.get('type')?.value as AccountType | null;
  }

  submit() {
    this.errorMsg = '';
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const { name, type, initialBalance } = this.form.getRawValue();
    try {
      this.createdId = this.bank.createAccount(name!, type!, +(initialBalance!));
      this.form.reset({ name: '', type: 'chequing', initialBalance: 0 });
    } catch (e: any) {
      this.errorMsg = e?.message ?? 'Failed to create account.';
    }
  }
}
