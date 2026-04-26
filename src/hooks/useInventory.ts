import { useState, useEffect, useCallback } from 'react';
import { Product, Transaction, TransactionType } from '../types';

export interface UseInventoryReturn {
  products: Product[];
  transactions: Transaction[];
  lastUpdated: Date | null;
  registerProduct: (product: Omit<Product, 'stockQuantity'> & { initialStock?: number }) => void;
  adjustStock: (sku: string, amount: number, type: TransactionType) => void;
  getTransactionHistory: (sku: string | undefined, page: number, limit: number) => {
    data: Transaction[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const useInventory = (): UseInventoryReturn => {
  const [products, setProducts] = useState<Record<string, Product>>({});
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Simulate 'last updated' timestamps whenever our core data changes
  useEffect(() => {
    setLastUpdated(new Date());
  }, [products, transactions]);

  const registerProduct = useCallback((
    productData: Omit<Product, 'stockQuantity'> & { initialStock?: number }
  ) => {
    setProducts((prev) => {
      if (prev[productData.sku]) {
        throw new Error(`Product with SKU ${productData.sku} already exists.`);
      }
      return {
        ...prev,
        [productData.sku]: {
          ...productData,
          stockQuantity: productData.initialStock || 0,
        },
      };
    });
  }, []);

  const adjustStock = useCallback((sku: string, amount: number, type: TransactionType) => {
    if (amount <= 0) {
      throw new Error('Adjustment amount must be greater than zero.');
    }

    setProducts((prevProducts) => {
      const product = prevProducts[sku];
      
      if (!product) {
        throw new Error(`Product with SKU ${sku} not found.`);
      }

      const newQuantity = type === 'added' 
        ? product.stockQuantity + amount 
        : product.stockQuantity - amount;

      if (newQuantity < 0) {
        throw new Error(`Insufficient stock for product ${sku}. Cannot reduce below zero.`);
      }

      const newTransaction: Transaction = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        productSku: sku,
        type,
        amount,
        timestamp: new Date().toISOString(),
      };
      
      setTransactions((prevTx) => [newTransaction, ...prevTx]);

      return {
        ...prevProducts,
        [sku]: {
          ...product,
          stockQuantity: newQuantity,
        },
      };
    });
  }, []);

  const getTransactionHistory = useCallback((sku?: string, page: number = 1, limit: number = 10) => {
    const filteredTransactions = sku 
      ? transactions.filter(t => t.productSku === sku)
      : transactions;

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    return {
      data: filteredTransactions.slice(startIndex, endIndex),
      total: filteredTransactions.length,
      page,
      limit,
      totalPages: Math.ceil(filteredTransactions.length / limit)
    };
  }, [transactions]);

  return {
    products: Object.values(products),
    transactions,
    lastUpdated,
    registerProduct,
    adjustStock,
    getTransactionHistory,
  };
};
