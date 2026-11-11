// frontend/src/contexts/AuthContext.tsx

import React, { createContext, useState, useContext, useEffect } from 'react';
import { apiRequest } from '../services/api';

export type Perfil = 'admin' | 'tecnico' | 'supervisor';

export interface User {
  id?: string;
  _id?: string;
  email: string;
  nome: string;
  perfil: Perfil;
}

interface LoginResponse {
  sucesso: boolean;
  mensagem: string;
  token: string;
  usuario: User;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // useEffect para restaurar a sessão do localStorage ao carregar a página
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('dm_cmms_token');
      const storedUser = localStorage.getItem('dm_cmms_user');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Falha ao restaurar autenticação:', error);
      localStorage.removeItem('dm_cmms_token');
      localStorage.removeItem('dm_cmms_user');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, senha: string) => {
    const data = await apiRequest<LoginResponse>('/usuarios/auth/login', {
      method: 'POST',
      data: { email, senha },
    });

    if (data.token && data.usuario) {
      setToken(data.token);
      setUser(data.usuario);
      localStorage.setItem('dm_cmms_token', data.token);
      localStorage.setItem('dm_cmms_user', JSON.stringify(data.usuario));
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('dm_cmms_token');
    localStorage.removeItem('dm_cmms_user');
  };

  const isAdmin = user?.perfil === 'admin';
  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isLoading,
        isAdmin,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider');
  }
  return context;
};