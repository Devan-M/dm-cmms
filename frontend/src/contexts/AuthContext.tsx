// ============================================
// DM-CMMS AuthContext - Gerenciamento de Autenticação
// ============================================

import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api'; // Axios instance configured with auth headers

type Perfil = 'admin' | 'tecnico' | 'supervisor';

interface User {
  id: string;
  email: string;
  nome: string;
  perfil: Perfil;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock auth state management for development without real API calls
const MOCK_USER_DATA: User[] = [
  { id: '1', email: 'admin@dm-cmms.com', nome: 'Administrador', perfil: 'admin' },
  { id: '2', email: 'tecnico1@dm-cmms.com', nome: 'Carlos Silva', perfil: 'tecnico' },
  { id: '3', email: 'supervisor@dm-cmms.com', nome: 'Ana Souza', perfil: 'supervisor' },
];

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(MOCK_USER_DATA[0]); // Default mock user for dev
  const [token, setToken] = useState<string>(''); // Mock token in development
  
  // In production, this would be fetched from localStorage on app load:
  // useEffect(() => {
  //   const storedUser = localStorage.getItem('dm-cmms-user');
  //   const storedToken = localStorage.getItem('dm-cmms-token');
  //   if (storedUser && storedToken) {
  //     setUser(JSON.parse(storedUser));
  //     setToken(storedToken);
  //   }
  // }, []);

  useEffect(() => {
    // In production: update auth state from API/Storage on every change
  }, [user, token]);

  const isAdmin = user?.perfil === 'admin';

  const login = (newToken: string) => {
    setToken(newToken);
    setUser(MOCK_USER_DATA[0]); // Set default mock user in dev
    // In production: localStorage.setItem('dm-cmms-token', newToken);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    // In production: localStorage.removeItem('dm-cmms-user');
    // In production: localStorage.removeItem('dm-cmms-token');
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isAuthenticated: !!token,
      isAdmin,
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  
  return context;
};

// Helper: Check if user is authenticated (can redirect to login in production)
export const requireAuth = () => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    window.location.href = '/login';
  }
};

// Helper: Check if user has admin role (for protected routes)
export const requireAdmin = () => {
  const { isAdmin } = useAuth();
  if (!isAdmin) {
    window.location.href = '/equipamentos'; // Redirect to available page
  }
};