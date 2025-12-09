// ============================================
// Redux Store Configuration
// ============================================
// 
// ما هو Store؟
// Store هو المكان الذي نخزن فيه جميع البيانات (State) في Redux
// 
// كيف يعمل؟
// 1. Store يحتوي على جميع Slices (auth, courses, etc.)
// 2. عندما نحدث State → Store يتم تحديثه
// 3. جميع المكونات المشتركة في Redux تحصل على التحديث
//
// مثال:
// const store = configureStore({
//   reducer: {
//     auth: authReducer,  // بيانات المصادقة
//     courses: coursesReducer,  // بيانات الكورسات
//   }
// });

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';

// ============================================
// Store Configuration
// ============================================
export const store = configureStore({
  // Reducers - معالجات State
  reducer: {
    auth: authReducer,  // بيانات المصادقة
    // يمكن إضافة reducers أخرى هنا:
    // courses: coursesReducer,
    // user: userReducer,
  },
  
  // Middleware - معالجات إضافية (اختياري)
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // تجاهل بعض الأنواع في Redux DevTools
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

// ============================================
// TypeScript Types
// ============================================
// هذه الأنواع تساعد TypeScript في فهم شكل State
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// ============================================
// Export Store
// ============================================
export default store;
