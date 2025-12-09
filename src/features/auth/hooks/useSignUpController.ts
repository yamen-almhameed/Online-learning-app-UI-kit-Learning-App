// ============================================
// SignUp Controller Hook - Business Logic
// ============================================

import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useAuth } from '../../../core/hooks/useAuth';
import { resetAuth } from '../../../core/store/authSlice';
import { VALIDATION, ERROR_MESSAGES } from '../../../core/constants/AppConstants';

// Types
interface SignUpErrors {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

interface UseSignUpControllerReturn {
  // State
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  errors: SignUpErrors;
  isLoading: boolean;

  // Actions
  setFullName: (value: string) => void;
  setEmail: (value: string) => void;
  setPassword: (value: string) => void;
  setConfirmPassword: (value: string) => void;
  handleSignUp: (onSuccess?: () => void) => Promise<void>;
  handleSocialSignUp: (provider: 'google' | 'apple') => void;
}

export const useSignUpController = (): UseSignUpControllerReturn => {
  const { register, isLoading } = useAuth();
  const dispatch = useDispatch();

  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<SignUpErrors>({});

  // Validate Form
  const validateForm = useCallback((): boolean => {
    const newErrors: SignUpErrors = {};

    // Validate Full Name - اختياري (لأننا نستخدم name من email)
    // إذا تم إدخاله، يجب أن يكون صحيحاً
    if (fullName.trim() && fullName.length < VALIDATION.NAME_MIN_LENGTH) {
      newErrors.fullName = 'Name must be at least 2 characters';
    }

    // Validate Email
    if (!email.trim()) {
      newErrors.email = ERROR_MESSAGES.REQUIRED_FIELD;
    } else if (!VALIDATION.EMAIL_REGEX.test(email)) {
      newErrors.email = ERROR_MESSAGES.INVALID_EMAIL;
    }

    // Validate Password
    if (!password) {
      newErrors.password = ERROR_MESSAGES.REQUIRED_FIELD;
    } else if (password.length < VALIDATION.PASSWORD_MIN_LENGTH) {
      newErrors.password = ERROR_MESSAGES.PASSWORD_WEAK;
    }

    // Validate Confirm Password
    if (!confirmPassword) {
      newErrors.confirmPassword = ERROR_MESSAGES.REQUIRED_FIELD;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = ERROR_MESSAGES.PASSWORDS_NOT_MATCH;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [fullName, email, password, confirmPassword]);

  // Handle SignUp
  const handleSignUp = useCallback(async (onSuccess?: () => void) => {
    if (!validateForm()) {
      return;
    }

    try {
      await register({ email, password, fullName });
      
      // مسح Redux state (لعدم تسجيل الدخول تلقائياً)
      dispatch(resetAuth());
      
      // الانتقال إلى Login بعد نجاح التسجيل
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Registration failed';
      setErrors({ email: errorMessage });
    }
  }, [email, password, fullName, validateForm, register, dispatch]);

  // Handle Social SignUp
  const handleSocialSignUp = useCallback((provider: 'google' | 'apple') => {
    // TODO: Implement social signup
  }, []);

  return {
    // State
    fullName,
    email,
    password,
    confirmPassword,
    errors,
    isLoading,

    // Actions
    setFullName,
    setEmail,
    setPassword,
    setConfirmPassword,
    handleSignUp,
    handleSocialSignUp,
  };
};

export default useSignUpController;
