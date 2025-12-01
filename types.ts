export interface Currency {
  code: string;
  symbol: string;
  name: string;
}

export interface Recurrence {
  type: 'daily' | 'weekly' | 'monthly';
  duration: number;
  weekdaysOnly: boolean;
}

export interface Transaction {
  id: number;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
  category: string;
  group: string | null;
  recurring: boolean;
  recurrence?: Recurrence | null;
  alert: boolean;
}

export interface GroupedTransactions {
  groups: {
    name: string;
    total: number;
    items: Transaction[];
  }[];
  singles: Transaction[];
}

export interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}