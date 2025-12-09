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
  // Add additional timeout settings
  validateStatus: (status) => status < 500, // Don't throw on 4xx errors
  // Additional timeout configuration for better handling
  httpAgent: undefined, // Let axios use default agent
  httpsAgent: undefined, // Let axios use default agent
  // Signal timeout for better cancellation support
  signal: undefined, // Can be set per request if needed
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
      
      // Log request in development
      if (__DEV__) {
        console.log('🚀 API Request:', {
          url: config.url,
          method: config.method,
          data: config.data,
        });
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
    // Log response in development
    if (__DEV__) {
      console.log('✅ API Response:', {
        url: response.config.url,
        status: response.status,
        data: response.data,
      });
    }
    
    // التحقق من أن الـ response هو JSON وليس HTML
    const data = response.data;
    if (typeof data === 'string' && data.trim().startsWith('<!DOCTYPE')) {
      console.error('❌ API Error: السيرفر يرجع HTML بدلاً من JSON');
      console.error('❌ تأكد أن السيرفر يعمل على:', response.config.baseURL);
      throw new Error('Server returned HTML instead of JSON. Please check if the server is running.');
    }
    
    // إذا كان الـ response يحتوي على data property (من ApiResponse)
    // مثال: { success: true, message: "...", data: { courses: [...] } }
    if (data && typeof data === 'object' && 'data' in data) {
      console.log('🔵 [apiClient] استخراج data من response.data.data');
      const extractedData = data.data;
      
      // إذا كان extractedData يحتوي على data مرة أخرى (nested)
      if (extractedData && typeof extractedData === 'object' && 'data' in extractedData) {
        console.log('🔵 [apiClient] استخراج data من response.data.data.data (nested)');
        return {
          ...response,
          data: extractedData.data,
        };
      }
      
      // إرجاع AxiosResponse مع data المستخرجة
      return {
        ...response,
        data: extractedData,
      };
    }
    
    // إذا كان الـ response مباشر (courses في الجذر أو array مباشر)
    // أو إذا كان response.data هو array مباشر (مثل search results)
    if (Array.isArray(data)) {
      console.log('🔵 [apiClient] Response.data is direct array');
      return response;
    }
    
    // إذا كان الـ response مباشر (object في الجذر)
    return response;
  },
  async (error: AxiosError<ApiError>) => {
    // Log error in development
    if (__DEV__) {
      console.log('❌ API Error:', {
        url: error.config?.url,
        status: error.response?.status,
        message: error.message,
        code: error.code,
        data: error.response?.data,
      });
    }
    
    // Handle timeout errors - comprehensive timeout error detection
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
      
      console.error('❌ Request Timeout:', timeoutDetails);
      
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
      // Network Error - عادة يحدث عندما:
      // 1. السيرفر غير شغال
      // 2. استخدام localhost على جهاز حقيقي (يجب استخدام IP)
      // 3. مشكلة في الاتصال بالشبكة
      console.error('❌ Network Error Details:');
      console.error('  - URL:', (error.config?.baseURL || '') + (error.config?.url || ''));
      console.error('  - Message:', error.message);
      console.error('  - Code:', error.code);
      console.error('  - إذا كنت على جهاز حقيقي، تأكد من استخدام IP جهاز الكمبيوتر بدلاً من localhost');
      
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

