// ============================================
// API Client - Axios instance with interceptors
// ============================================

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ENDPOINTS, STORAGE_KEYS, APP_SETTINGS } from '../constants/AppConstants';

// Types
interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
}

interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

// ============================================
// إنشاء axios instance - هذا هو العميل الذي سيرسل الطلبات للـ API
// ============================================
// baseURL: العنوان الأساسي للـ API
// عندما نكتب api.post('/auth/login') سيصبح: http://localhost:5000/api/auth/login
const apiClient: AxiosInstance = axios.create({
  baseURL: ENDPOINTS.BASE_URL, // 'http://localhost:5000/api'
  timeout: APP_SETTINGS.API_TIMEOUT, // 60 ثانية
  headers: {
    'Content-Type': 'application/json', // نوع البيانات المرسلة
    'Accept': 'application/json', // نوع البيانات المتوقعة
  },
  validateStatus: (status) => status < 500,
});

// ============================================
// Request Interceptor - يعمل قبل إرسال كل طلب
// ============================================
// هذا الكود يعمل تلقائياً قبل كل طلب API
// يضيف Token في الـ Header إذا كان موجود
apiClient.interceptors.request.use(
  async (config: AxiosRequestConfig): Promise<any> => {
    try {
      // جلب Token من AsyncStorage
      const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
      
      // إذا كان Token موجود، أضفه في Header
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      // Add language header
      const language = await AsyncStorage.getItem(STORAGE_KEYS.LANGUAGE);
      if (language && config.headers) {
        config.headers['Accept-Language'] = language;
      }
      
      return config;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    const data = response.data;
    
    if (typeof data === 'string' && data.trim().startsWith('<!DOCTYPE')) {
      if (__DEV__) {
        console.error('Server returned HTML instead of JSON:', response.config.baseURL);
      }
      throw new Error('Server returned HTML instead of JSON. Please check if the server is running.');
    }
    
    if (data && typeof data === 'object' && 'data' in data) {
      const extractedData = data.data;
      
      if (extractedData && typeof extractedData === 'object' && 'data' in extractedData) {
        return {
          ...response,
          data: extractedData.data,
        };
      }
      
      return {
        ...response,
        data: extractedData,
      };
    }
    
    return response;
  },
  async (error: AxiosError<ApiError>) => {
    // Handle timeout errors
    const isTimeoutError = 
      error.code === 'ECONNABORTED' || 
      error.code === 'ETIMEDOUT' ||
      error.code === 'UND_ERR_HEADERS_TIMEOUT' ||
      error.code === 'UND_ERR_BODY_TIMEOUT' ||
      error.code === 'UND_ERR_CONNECT_TIMEOUT' ||
      error.message?.toLowerCase().includes('timeout') || 
      error.message?.toLowerCase().includes('headers timeout') ||
      error.message?.toLowerCase().includes('request timeout') ||
      (error.response?.status === 408);
    
    if (isTimeoutError) {
      const timeoutDetails = {
        url: (error.config?.baseURL || '') + (error.config?.url || ''),
        timeout: error.config?.timeout || APP_SETTINGS.API_TIMEOUT,
        code: error.code,
        message: error.message,
        type: error.code === 'UND_ERR_HEADERS_TIMEOUT' ? 'Headers Timeout' :
              error.code === 'UND_ERR_BODY_TIMEOUT' ? 'Body Timeout' :
              error.code === 'UND_ERR_CONNECT_TIMEOUT' ? 'Connection Timeout' :
              'Request Timeout',
      };
      
      if (__DEV__) {
        console.error('Request Timeout:', timeoutDetails);
      }
      
      // Provide more specific error messages based on timeout type
      let userMessage = 'Request timeout. The server is taking too long to respond.';
      if (error.code === 'UND_ERR_HEADERS_TIMEOUT') {
        userMessage = 'Server is taking too long to send response headers. Please check your connection and try again.';
      } else if (error.code === 'UND_ERR_CONNECT_TIMEOUT') {
        userMessage = 'Connection timeout. Unable to reach the server. Please check your network connection.';
      } else if (error.code === 'UND_ERR_BODY_TIMEOUT') {
        userMessage = 'Server is taking too long to send response data. Please try again.';
      }
      
      return Promise.reject({
        message: userMessage,
        code: error.code || 'TIMEOUT_ERROR',
        status: 408,
        originalError: error,
        timeoutDetails,
      });
    }
    
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      // Clear stored tokens
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.TOKEN,
        STORAGE_KEYS.REFRESH_TOKEN,
        STORAGE_KEYS.USER,
      ]);
      
      // You can dispatch a logout action here or navigate to login
      // navigationRef.current?.navigate('Login');
    }
    
    // Handle network error
    if (!error.response) {
      if (__DEV__) {
        console.error('Network Error:', {
          url: (error.config?.baseURL || '') + (error.config?.url || ''),
          message: error.message,
          code: error.code,
        });
      }
      
      return Promise.reject({
        message: 'Network error. Please check your connection. If using a real device, use your computer IP instead of localhost.',
        code: error.code || 'NETWORK_ERROR',
      });
    }
    
    // Return error response
    return Promise.reject({
      message: error.response?.data?.message || 'Something went wrong',
      code: error.response?.data?.code,
      status: error.response?.status,
    });
  }
);

// API Methods
export const api = {
  get: <T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => 
    apiClient.get(url, config),
    
  post: <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => 
    apiClient.post(url, data, config),
    
  put: <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => 
    apiClient.put(url, data, config),
    
  patch: <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => 
    apiClient.patch(url, data, config),
    
  delete: <T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => 
    apiClient.delete(url, config),
};

export default apiClient;

