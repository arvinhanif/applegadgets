
export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE'
}

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER'
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  date: string;
}

export interface DashboardStats {
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
}

export interface UserProfile {
  name: string;
  currency: string;
  avatarSeed: string;
  role: UserRole;
}
