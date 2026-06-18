import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import {
  loginWithDirectus,
  logoutFromDirectus,
  getCurrentUser,
} from '../services/auth.service';

interface AuthUser {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  avatar: string | null;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const DirectusAuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch the user on initial load
  useEffect(() => {
    getCurrentUser()
      .then((data: any) => {
        setUser(data);
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const login = async (email: string, password: string) => {
    await loginWithDirectus(email, password);
    const data: any = await getCurrentUser();
    setUser(data);
  };

  const logout = async () => {
    try {
      await logoutFromDirectus();
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useDirectusAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useDirectusAuth must be used within a DirectusAuthProvider');
  }
  return context;
};
