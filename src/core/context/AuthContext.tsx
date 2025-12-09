// ============================================
// Auth Context - Authentication state management
// ============================================

import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants/AppConstants';
import { User, AuthResponse, LoginRequest, RegisterRequest } from '../api/services/AuthService';

// Types
export interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: Partial<User>) => void;
  setAuthData: (data: AuthResponse) => Promise<void>;
}

// Create context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Props
interface AuthProviderProps {
  children: ReactNode;
}

// Provider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if authenticated
  const isAuthenticated = !!token && !!user;

  // Load auth state on mount
  useEffect(() => {
    loadAuthState();
  }, []);

  // Load auth state from storage
  const loadAuthState = async () => {
    try {
      const [storedToken, storedUser] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.TOKEN),
        AsyncStorage.getItem(STORAGE_KEYS.USER),
      ]);

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.log('Error loading auth state:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Save auth data to storage
  const saveAuthData = async (authData: AuthResponse) => {
    try {
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.TOKEN, authData.token),
        AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(authData.user)),
        authData.refreshToken 
          ? AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, authData.refreshToken)
          : Promise.resolve(),
      ]);
    } catch (error) {
      console.log('Error saving auth data:', error);
    }
  };

  // Clear auth data from storage
  const clearAuthData = async () => {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.TOKEN,
        STORAGE_KEYS.REFRESH_TOKEN,
        STORAGE_KEYS.USER,
      ]);
    } catch (error) {
      console.log('Error clearing auth data:', error);
    }
  };

  // Set auth data (for social login or external auth)
  const setAuthData = useCallback(async (data: AuthResponse) => {
    setToken(data.token);
    setUser(data.user);
    await saveAuthData(data);
  }, []);

  // Login
  const login = useCallback(async (data: LoginRequest) => {
    setIsLoading(true);
    try {
      // Import AuthService here to avoid circular dependency
      const { AuthService } = await import('../api/services/AuthService');
      const response = await AuthService.login(data);
      
      setToken(response.token);
      setUser(response.user);
      await saveAuthData(response);

      // Save remember me preference
      if (data.rememberMe) {
        await AsyncStorage.setItem(STORAGE_KEYS.REMEMBER_ME, 'true');
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Register
  const register = useCallback(async (data: RegisterRequest) => {
    setIsLoading(true);
    try {
      const { AuthService } = await import('../api/services/AuthService');
      const response = await AuthService.register(data);
      
      setToken(response.token);
      setUser(response.user);
      await saveAuthData(response);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Logout
  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      // Call logout API
      const { AuthService } = await import('../api/services/AuthService');
      await AuthService.logout();
    } catch (error) {
      // Continue with local logout even if API fails
      console.log('Logout API error:', error);
    } finally {
      // Clear local state
      setToken(null);
      setUser(null);
      await clearAuthData();
      setIsLoading(false);
    }
  }, []);

  // Update user data
  const updateUser = useCallback((userData: Partial<User>) => {
    setUser(prev => {
      if (!prev) return null;
      const updated = { ...prev, ...userData };
      // Save updated user to storage
      AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Context value
  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser,
    setAuthData,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

