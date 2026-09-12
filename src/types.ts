export type TabType = 'timeline' | 'analytics' | 'quick-add' | 'assets';

export type TransactionType = 'expense' | 'income' | 'transfer';

export interface Transaction {
  id: string;
  title: string;
  category: string;
  categoryIcon: string;
  amount: number;
  type: TransactionType;
  date: string; // e.g. '2024-10-24'
  time: string; // e.g. '14:28'
  note?: string;
  account: string;
}

export interface AccountItem {
  id: string;
  name: string;
  group: 'cash' | 'credit' | 'investment';
  subText: string;
  balance: number;
  icon: string;
  extra?: string;
  creditLimit?: number;
  returnRate?: string;
}

export interface CategoryItem {
  id: string;
  name: string;
  icon: string;
  color?: string;
  subCategories?: { name: string; amount: number }[];
}
