import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Simple password-only auth; in production, use a proper backend
const ADMIN_PASSWORD = 'Mahidhar';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated (stored in localStorage)
    const authStatus = localStorage.getItem('admin_auth');
    if (authStatus === 'true') {
      // Verify that the session is still valid by checking timestamp
      const authTime = localStorage.getItem('admin_auth_time');
      if (authTime) {
        const now = new Date().getTime();
        const authTimestamp = parseInt(authTime);
        // Session expires after 1 hour (60 ms)
        if (now - authTimestamp < 60) {
          setIsAuthenticated(true);
        } else {
          // Session expired, clear auth data
          localStorage.removeItem('admin_auth');
          localStorage.removeItem('admin_auth_time');
        }
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Validate password only; ignore username
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem('admin_auth', 'true');
      localStorage.setItem('admin_auth_time', new Date().getTime().toString());
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin_auth');
    localStorage.removeItem('admin_auth_time');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};