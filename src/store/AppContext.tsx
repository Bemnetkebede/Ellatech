import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User } from '../types';
import { useInventory, UseInventoryReturn } from '../hooks/useInventory';

interface AppContextType extends UseInventoryReturn {
  user: User | null;
  registerUser: (name: string, email: string) => void;
  logout: () => void;
  isReady: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const inventory = useInventory();
  const [user, setUser] = useState<User | null>(null);
  const [isReady, setIsReady] = useState(false);

  // Initialize with some mock products on first load
  useEffect(() => {
    if (inventory.products.length === 0) {
      try {
        inventory.registerProduct({
          sku: 'LAP-001',
          name: 'MacBook Pro 16"',
          price: 2499.99,
          initialStock: 15,
        });
        inventory.registerProduct({
          sku: 'PHONE-002',
          name: 'iPhone 15 Pro',
          price: 999.00,
          initialStock: 0,
        });
      } catch (error) {
        // Ignore errors from hot reloads causing duplicate SKUs
      }
    }
    setIsReady(true);
  }, [inventory]);

  const registerUser = (name: string, email: string) => {
    setUser({
      id: Math.random().toString(36).substring(2, 11),
      name,
      email,
      createdAt: new Date().toISOString(),
    });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AppContext.Provider value={{ ...inventory, user, registerUser, logout, isReady }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppStore = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppStore must be used within an AppProvider');
  }
  return context;
};
