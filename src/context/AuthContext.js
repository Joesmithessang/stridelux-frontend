import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authService.getCurrentUser().then((user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    const handleUnauthorized = () => {
      setCurrentUser(null);
    };
    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, []);

  const login = useCallback(async (email, password) => {
    const user = await authService.login(email, password);
    const profile = await authService.getCurrentUser();
    setCurrentUser(profile);
    return profile;
  }, []);

  const register = useCallback(async (data) => {
    const result = await authService.register(data);
    const profile = await authService.getCurrentUser();
    setCurrentUser(profile);
    return result;
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setCurrentUser(null);
  }, []);

  const isAuthenticated = Boolean(currentUser);
  const isAdmin = currentUser?.group === 'Admins';

  return (
    <AuthContext.Provider value={{ currentUser, loading, isAuthenticated, isAdmin, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
