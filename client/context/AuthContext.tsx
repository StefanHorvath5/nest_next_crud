
// context/AuthContext.tsx
'use client';
import { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: number;
  email: string;
  role: string;
}

interface AuthContextProps {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AuthContext = createContext<AuthContextProps>({} as any);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      setToken(token);
      setUser(JSON.parse(user));
    }
  }, []);

  const login = async (email: string, password: string) => {
    const res = await fetch('http://localhost:3001/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) throw new Error('Login failed');

    const data = await res.json();
    localStorage.setItem('token', data.access_token);
    
    const payload = JSON.parse(atob(data.access_token.split('.')[1]));
    const userData = {
      id: payload.sub,
      email: payload.username,
      role: payload.role,
    };

    localStorage.setItem('user', JSON.stringify(userData));
    setToken(data.access_token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
