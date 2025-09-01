import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountType } from '../../models/account';

@Component({
  selector: 'app-type-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './type-button.component.html',
  styleUrls: ['./type-button.component.scss'],
})
export class TypeButtonComponent {
  @Input() label = 'Submit';
  @Input() accountType: AccountType | 'default' = 'default';
  @Input() disabled = false;
  @Output() pressed = new EventEmitter<void>();

  get btnClass(): string {
    switch (this.accountType) {
      case 'chequing': return 'btn btn-primary';
      case 'savings':  return 'btn btn-success';
      default:         return 'btn btn-secondary';
    }
  }
}
