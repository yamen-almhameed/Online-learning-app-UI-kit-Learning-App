// ============================================
// App Constants - Application-wide constants
// ============================================

export const APP_NAME = 'Salford';
export const APP_TAGLINE = 'Best Education For You';
export const APP_VERSION = '1.0.0';

// API Endpoints
export const ENDPOINTS = {
  // ⚠️ مهم: 
  // - Android Emulator: استخدم 10.0.2.2 (يشير إلى localhost على الكمبيوتر)
  // - iOS Simulator: استخدم localhost
  // - جهاز حقيقي: استخدم IP الكمبيوتر (مثل 192.168.137.1)
  BASE_URL: 'http://192.168.137.1:5000/api',  // ✅ جهاز حقيقي - IP الكمبيوتر
  
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  GET_CURRENT_USER: '/auth/me',
  GOOGLE_LOGIN: '/auth/google',
  APPLE_LOGIN: '/auth/apple',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  VERIFY_OTP: '/auth/verify-otp',
  RESEND_OTP: '/auth/resend-otp',
  SOCIAL_LOGIN: '/auth/social',
  
  // User
  PROFILE: '/users/profile',
  UPDATE_PROFILE: '/users/profile',
  CHANGE_PASSWORD: '/user/change-password',
  DELETE_ACCOUNT: '/user/delete',
  UPLOAD_PROFILE_PICTURE: '/users/profile/picture',
  GET_COURSE_HISTORY: '/users/history',
  ADD_TO_HISTORY: '/users/history/:courseId',
  
  // Courses
  COURSES: '/courses',
  COURSE_DETAILS: '/courses/:id',
  COURSE_LESSONS: '/courses/:id/lessons',
  COURSE_REVIEWS: '/courses/:id/reviews',
  COURSE_ENROLL: '/courses/:id/enroll',
  
  // User Courses
  MY_COURSES: '/courses/my-courses',
  COURSE_PROGRESS: '/user/courses/:id/progress',
  USER_HISTORY: '/users/history/:courseId',
  
  // Search & Filter
  SEARCH: '/courses/search',
  CATEGORIES: '/categories',
  
  // Payment
  PAYMENT_METHODS: '/payment/methods',
  USER_PAYMENT_METHODS: '/users/payment-methods',
  CREATE_PAYMENT: '/payment/create',
  SUBSCRIPTION_PLANS: '/subscriptions/plans',
  SUBSCRIBE: '/subscriptions/subscribe',
  CURRENT_SUBSCRIPTION: '/subscriptions/current',
  
  // Notifications
  NOTIFICATIONS: '/notifications',
  NOTIFICATION_SETTINGS: '/notifications/settings',
};

// Storage Keys for AsyncStorage
export const STORAGE_KEYS = {
  TOKEN: '@salford_token',
  REFRESH_TOKEN: '@salford_refresh_token',
  USER: '@salford_user',
  LANGUAGE: '@salford_language',
  THEME: '@salford_theme',
  ONBOARDING_COMPLETED: '@salford_onboarding',
  REMEMBER_ME: '@salford_remember_me',
  RECENT_SEARCHES: '@salford_recent_searches',
  FAVORITES: '@salford_favorites',
  NOTIFICATIONS_ENABLED: '@salford_notifications',
};

// Course Categories
export const COURSE_CATEGORIES = [
  { id: '1', name: 'UI & UX', icon: 'palette' },
  { id: '2', name: 'Animation', icon: 'movie' },
  { id: '3', name: 'Graphic Design', icon: 'brush' },
  { id: '4', name: 'Programming', icon: 'code' },
  { id: '5', name: 'Business', icon: 'briefcase' },
  { id: '6', name: 'Marketing', icon: 'trending-up' },
  { id: '7', name: 'Data Science', icon: 'bar-chart' },
  { id: '8', name: 'Photography', icon: 'camera' },
];

// Onboarding Slides
export const ONBOARDING_SLIDES = [
  {
    id: '1',
    title: 'Welcome to',
    highlight: 'SALFORD',
    description: 'Unlock the best IT courses for your career growth.',
    backgroundColor: '#E0F5F0',
    image: 'onboarding1',
  },
  {
    id: '2',
    title: 'Explore a wide range of',
    highlight: 'IT Courses',
    description: 'From coding to cybersecurity, we have it all!',
    backgroundColor: '#FFE5D9',
    image: 'onboarding2',
  },
  {
    id: '3',
    title: 'Learn on your own',
    highlight: 'Schedule',
    description: 'Access courses on the go, anytime, from anywhere.',
    backgroundColor: '#D4E8F5',
    image: 'onboarding3',
  },
  {
    id: '4',
    title: 'Ready to dive into',
    highlight: 'Learning?',
    description: 'Access courses on the go, anytime, from anywhere.',
    backgroundColor: '#D4E8F5',
    image: 'onboarding4',
  },
];

// App Settings
export const APP_SETTINGS = {
  DEFAULT_LANGUAGE: 'en',
  SUPPORTED_LANGUAGES: ['en', 'ar'],
  DEFAULT_THEME: 'light',
  API_TIMEOUT: 60000, // زيادة timeout إلى 60 ثانية
  MAX_RETRY_ATTEMPTS: 3,
  PAGINATION_LIMIT: 10,
  SEARCH_DEBOUNCE: 500,
};

// Validation Rules
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  PHONE_REGEX: /^\+?[1-9]\d{1,14}$/,
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Please check your internet connection',
  SERVER_ERROR: 'Something went wrong. Please try again later',
  INVALID_CREDENTIALS: 'Invalid email or password',
  EMAIL_EXISTS: 'Email already registered',
  INVALID_EMAIL: 'Please enter a valid email address',
  PASSWORD_WEAK: 'Password must be at least 8 characters with uppercase, lowercase, and number',
  PASSWORDS_NOT_MATCH: 'Passwords do not match',
  REQUIRED_FIELD: 'This field is required',
  SESSION_EXPIRED: 'Your session has expired. Please login again',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Welcome back!',
  REGISTER_SUCCESS: 'Account created successfully',
  PASSWORD_RESET: 'Password reset link sent to your email',
  PROFILE_UPDATED: 'Profile updated successfully',
  COURSE_ENROLLED: 'Successfully enrolled in course',
  PAYMENT_SUCCESS: 'Payment completed successfully',
};

