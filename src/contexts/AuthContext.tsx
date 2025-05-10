import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { getUser, saveUser, clearUser } from '../utils/localStorage';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (username: string, password: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // Check if user exists in localStorage
    const storedUser = getUser();
    if (storedUser) {
      setUser(storedUser);
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    // For demo purposes, we're using a simple authentication
    // In a real app, you would verify credentials with a backend
    if (username && password) {
      // Simple validation for demo
      const newUser: User = {
        id: Date.now().toString(),
        username,
        favorites: [],
      };
      
      setUser(newUser);
      setIsAuthenticated(true);
      saveUser(newUser);
      return true;
    }
    return false;
  };

  const logout = (): void => {
    setUser(null);
    setIsAuthenticated(false);
    clearUser();
  };

  const register = async (username: string, password: string): Promise<boolean> => {
    // For demo purposes, we're using a simple registration
    // In a real app, you would register with a backend
    if (username && password) {
      const newUser: User = {
        id: Date.now().toString(),
        username,
        favorites: [],
      };
      
      setUser(newUser);
      setIsAuthenticated(true);
      saveUser(newUser);
      return true;
    }
    return false;
  };

  const value = {
    user,
    isAuthenticated,
    login,
    logout,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 