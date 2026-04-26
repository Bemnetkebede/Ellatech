export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  createdAt: Date | string;
}

export interface Product {
  sku: string;
  name: string;
  description?: string;
  price: number;
  stockQuantity: number;
  category?: string;
  imageUrl?: string;
}

export type TransactionType = 'added' | 'removed';

export interface Transaction {
  id: string;
  productSku: string;
  type: TransactionType;
  amount: number;
  timestamp: Date | string;
}
