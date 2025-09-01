export type AccountType = 'chequing' | 'savings';

export interface Account {
  id: number;
  name: string;
  type: AccountType;
  balance: number;
}
