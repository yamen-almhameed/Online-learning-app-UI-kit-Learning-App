// ============================================
// Auth Service - Authentication API calls
// ============================================

import { api } from '../apiClient';
import { ENDPOINTS } from '../../constants/AppConstants';

// Types
export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName?: string;
  phone?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;  // من الـ API
  fullName?: string;  // للتوافق مع الكود القديم
  avatar?: string;
  profilePicture?: string | null;  // من الـ API
  phone?: string;
  isVerified?: boolean;
  createdAt?: string;
  subscription?: {
    plan: string;
    isActive: boolean;
  };
}

export interface SocialLoginRequest {
  provider: 'google' | 'apple' | 'facebook';
  token: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  otp: string;
  newPassword: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

// Auth Service
export const AuthService = {
  /**
   * Login with email and password
   */
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>(ENDPOINTS.LOGIN, data);
    
    // apiClient interceptor already extracts data.data, so response.data is AuthResponse
    // response is AxiosResponse, response.data is the extracted data
    const authData = (response as any).data;
    
    if (!authData || !authData.user || !authData.token) {
      throw new Error('Invalid response from server - missing user or token');
    }
    
    // Transform user structure to match app expectations
    const user: User = {
      ...authData.user,
      fullName: authData.user.name || authData.user.fullName || '',
      avatar: authData.user.profilePicture || authData.user.avatar,
    };
    
    return {
      user,
      token: authData.token,
      refreshToken: authData.refreshToken,
    };
  },

  /**
   * Register new user
   * Extracts name from email (part before @) and sends to API
   */
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    // Extract name from email (part before @)
    const nameFromEmail = data.email.split('@')[0];
    
    const response = await api.post<any>(ENDPOINTS.REGISTER, {
      email: data.email,
      password: data.password,
      name: nameFromEmail,
    });
    
    // apiClient interceptor already extracts data.data, so response.data is AuthResponse
    // response is AxiosResponse, response.data is the extracted data
    const authData = (response as any).data;
    
    if (!authData || !authData.user || !authData.token) {
      throw new Error('Invalid response from server - missing user or token');
    }
    
    // Transform user structure to match app expectations
    const user: User = {
      ...authData.user,
      fullName: (authData.user as any).name || authData.user.fullName || '',
      avatar: (authData.user as any).profilePicture || authData.user.avatar,
    };
    
    return {
      user,
      token: authData.token,
      refreshToken: (authData as any).refreshToken,
    };
  },

  /**
   * Logout user
   */
  logout: async (): Promise<void> => {
    await api.post(ENDPOINTS.LOGOUT);
  },

  /**
   * Social login (Google, Apple, Facebook)
   */
  socialLogin: async (data: SocialLoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>(ENDPOINTS.SOCIAL_LOGIN, data);
    return response.data;
  },

  /**
   * Request password reset
   */
  forgotPassword: async (data: ForgotPasswordRequest): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>(ENDPOINTS.FORGOT_PASSWORD, data);
    return response.data;
  },

  /**
   * Reset password with OTP
   */
  resetPassword: async (data: ResetPasswordRequest): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>(ENDPOINTS.RESET_PASSWORD, data);
    return response.data;
  },

  /**
   * Verify OTP code
   */
  verifyOtp: async (data: VerifyOtpRequest): Promise<{ verified: boolean }> => {
    const response = await api.post<{ verified: boolean }>(ENDPOINTS.VERIFY_OTP, data);
    return response.data;
  },

  /**
   * Resend OTP code
   */
  resendOtp: async (email: string): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>(ENDPOINTS.RESEND_OTP, { email });
    return response.data;
  },
};

export default AuthService;

