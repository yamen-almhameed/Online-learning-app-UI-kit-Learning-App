// ============================================
// Login Controller Hook - Business Logic
// ============================================

import { useState, useCallback } from 'react';
import { useAuth } from '../../../core/hooks/useAuth';
import { VALIDATION, ERROR_MESSAGES } from '../../../core/constants/AppConstants';

// Types
interface LoginErrors {
  email?: string;
  password?: string;
}

interface UseLoginControllerReturn {
  // State
  email: string;
  password: string;
  rememberMe: boolean;
  errors: LoginErrors;
  isLoading: boolean;
  
  // Actions
  setEmail: (value: string) => void;
  setPassword: (value: string) => void;
  setRememberMe: (value: boolean) => void;
  handleLogin: () => Promise<void>;
  handleSocialLogin: (provider: 'google' | 'apple') => void;
}

export const useLoginController = (): UseLoginControllerReturn => {
  const { login, isLoading } = useAuth();

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [errors, setErrors] = useState<LoginErrors>({});

  // Validate Form
  const validateForm = useCallback((): boolean => {
    const newErrors: LoginErrors = {};

    if (!email.trim()) {
      newErrors.email = ERROR_MESSAGES.REQUIRED_FIELD;
    } else if (!VALIDATION.EMAIL_REGEX.test(email)) {
      newErrors.email = ERROR_MESSAGES.INVALID_EMAIL;
    }

    if (!password) {
      newErrors.password = ERROR_MESSAGES.REQUIRED_FIELD;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [email, password]);

  // Handle Login
  const handleLogin = useCallback(async () => {
    if (!validateForm()) {
      throw new Error('Please fill in all required fields');
    }

    try {
      await login({ email, password, rememberMe });
    } catch (error: any) {
      setErrors({ password: error.message || ERROR_MESSAGES.INVALID_CREDENTIALS });
      throw error;
    }
  }, [email, password, rememberMe, validateForm, login]);

  // Handle Social Login
  const handleSocialLogin = useCallback((provider: 'google' | 'apple') => {
    // TODO: Implement social login
  }, []);

  return {
    // State
    email,
    password,
    rememberMe,
    errors,
    isLoading,
    
    // Actions
    setEmail,
    setPassword,
    setRememberMe,
    handleLogin,
    handleSocialLogin,
  };
};

export default useLoginController;
