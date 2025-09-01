export interface Transaction {
    id: number;
    date: string;
    fromAccountId: number;
    toAccountId: number;
    amount: number;
    note?: string;
  }
