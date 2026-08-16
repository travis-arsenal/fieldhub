import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User } from '../types';
import { MOCK_USERS } from '../data/mock';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isManager: boolean;
  isStaff: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Simple demo credentials (in real app this would be backend + hashed passwords)
const DEMO_PASSWORDS: Record<string, string> = {
  'admin@huntarsenal.com': 'arsenal2026',
  'manager@huntarsenal.com': 'arsenal2026',
  'alex.hunter@email.com': 'staff123',
  'sam.pro@email.com': 'staff123',
  'casey.field@email.com': 'staff123',
  'morgan.trail@email.com': 'staff123',
  'jamie.ridge@email.com': 'staff123',
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('fieldhub_user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem('fieldhub_user');
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    const found = MOCK_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!found) {
      return { success: false, error: 'No account found with that email.' };
    }
    const expected = DEMO_PASSWORDS[found.email];
    if (password !== expected) {
      return { success: false, error: 'Incorrect password.' };
    }
    setUser(found);
    localStorage.setItem('fieldhub_user', JSON.stringify(found));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('fieldhub_user');
  };

  const isManager = user?.role === 'admin' || user?.role === 'manager';
  const isStaff = user?.role === 'staff';

  return (
    <AuthContext.Provider value={{ user, login, logout, isManager, isStaff }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
