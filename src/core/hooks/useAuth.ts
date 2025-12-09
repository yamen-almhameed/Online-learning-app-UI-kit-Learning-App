// ============================================
// useAuth Hook - Redux Hook for Authentication
// ============================================

import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import {
  selectUser,
  selectToken,
  selectIsLoading,
  selectError,
  selectIsAuthenticated,
  loginAsync,
  registerAsync,
  logoutAsync,
  updateUser,
  setAuthData,
  clearError,
} from '../store';
import { LoginRequest, RegisterRequest, AuthResponse } from '../api/services/AuthService';

// ============================================
// useAuth Hook
// ============================================
export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  // Selectors
  const user = useSelector(selectUser);
  const token = useSelector(selectToken);
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  
  // Actions
  const login = useCallback(
    async (data: LoginRequest): Promise<void> => {
      const result = await dispatch(loginAsync(data));
      if (loginAsync.rejected.match(result)) {
        throw new Error(result.payload as string);
      }
    },
    [dispatch]
  );
  
  const register = useCallback(
    async (data: RegisterRequest): Promise<void> => {
      const result = await dispatch(registerAsync(data));
      if (registerAsync.rejected.match(result)) {
        throw new Error(result.payload as string);
      }
    },
    [dispatch]
  );
  
  const logout = useCallback(async (): Promise<void> => {
    await dispatch(logoutAsync());
  }, [dispatch]);
  
  const updateUserData = useCallback(
    (userData: Parameters<typeof updateUser>[0]) => {
      dispatch(updateUser(userData));
    },
    [dispatch]
  );
  
  const setAuthDataAction = useCallback(
    async (data: AuthResponse): Promise<void> => {
      dispatch(setAuthData(data));
    },
    [dispatch]
  );
  
  const clearErrorAction = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);
  
  return {
    // State
    user,
    token,
    isLoading,
    error,
    isAuthenticated,
    
    // Actions
    login,
    register,
    logout,
    updateUser: updateUserData,
    setAuthData: setAuthDataAction,
    clearError: clearErrorAction,
  };
};

export default useAuth;

