import React, { createContext, useContext, useEffect, useState } from 'react';
import { StorageService } from '../service/storage';

interface AuthContextType {
  isLoggedIn: boolean;
  taiKhoanId: number | null;
  chuSoHuu: boolean | null;
  isLoading: boolean;
  login: (taiKhoanId: number, chuSoHuu: boolean) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [taiKhoanId, setTaiKhoanId] = useState<number | null>(null);
  const [chuSoHuu, setChuSoHuu] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const loginInfo = await StorageService.getLoginInfo();
      setIsLoggedIn(loginInfo.isLoggedIn);
      setTaiKhoanId(loginInfo.taiKhoanId);
      setChuSoHuu(loginInfo.chuSoHuu);
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (taiKhoanId: number, chuSoHuu: boolean) => {
    await StorageService.saveLoginInfo(taiKhoanId, chuSoHuu);
    setTaiKhoanId(taiKhoanId);
    setChuSoHuu(chuSoHuu);
    setIsLoggedIn(true);
  };

  const logout = async () => {
    await StorageService.logout();
    setTaiKhoanId(null);
    setChuSoHuu(null);
    setIsLoggedIn(false);
  };

  const value: AuthContextType = {
    isLoggedIn,
    taiKhoanId,
    chuSoHuu,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
