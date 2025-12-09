// ============================================
// Auth Slice - Redux Toolkit Slice for Authentication
// ============================================

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants/AppConstants';
import { 
  AuthService, 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse, 
  User 
} from '../api/services/AuthService';

// ============================================
// State Interface
// ============================================
interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;
}

// ============================================
// Initial State
// ============================================
const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  isLoading: false,
  error: null,
};

// ============================================
// Async Thunks
// ============================================

/**
 * Login Async Thunk
 */
export const loginAsync = createAsyncThunk(
  'auth/login',
  async (data: LoginRequest, { rejectWithValue }) => {
    try {
      const response = await AuthService.login(data);
      
      if (!response || !response.user || !response.token) {
        throw new Error('Invalid response from server. Missing user or token.');
      }
      
      // Save to AsyncStorage
      await AsyncStorage.multiSet([
        [STORAGE_KEYS.TOKEN, response.token],
        [STORAGE_KEYS.USER, JSON.stringify(response.user)],
      ]);
      
      // Save remember me preference
      if (data.rememberMe) {
        await AsyncStorage.setItem(STORAGE_KEYS.REMEMBER_ME, 'true');
      }
      
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

/**
 * Register Async Thunk
 */
export const registerAsync = createAsyncThunk(
  'auth/register',
  async (data: RegisterRequest, { rejectWithValue }) => {
    try {
      const response = await AuthService.register(data);
      
      if (!response || !response.user || !response.token) {
        throw new Error('Invalid response from server. Missing user or token.');
      }
      
      // لا نحفظ البيانات في AsyncStorage عند Registration
      // المستخدم يجب أن يسجل دخول يدوياً بعد إنشاء الحساب
      
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Registration failed');
    }
  }
);

/**
 * Logout Async Thunk
 */
export const logoutAsync = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      // استدعاء API Logout
      await AuthService.logout();
    } catch (error) {
      // حتى لو فشل API، نكمل Logout محلياً
      console.log('Logout API error:', error);
    } finally {
      // حذف البيانات من AsyncStorage
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.TOKEN,
        STORAGE_KEYS.REFRESH_TOKEN,
        STORAGE_KEYS.USER,
      ]);
    }
    // إرجاع void للدلالة على نجاح العملية
    return undefined;
  }
);

/**
 * Load Auth State Async Thunk
 * تحميل حالة المصادقة من AsyncStorage عند بدء التطبيق
 */
export const loadAuthStateAsync = createAsyncThunk(
  'auth/loadAuthState',
  async () => {
    try {
      const [token, user, refreshToken] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.TOKEN),
        AsyncStorage.getItem(STORAGE_KEYS.USER),
        AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN),
      ]);

      if (token && user) {
        return {
          token,
          user: JSON.parse(user),
          refreshToken: refreshToken || null,
        };
      }
      
      return null;
    } catch (error) {
      console.log('Error loading auth state:', error);
      return null;
    }
  }
);

// ============================================
// Auth Slice - تعريف Slice
// ============================================
const authSlice = createSlice({
  name: 'auth',  // اسم الـ slice
  
  initialState,  // الحالة الابتدائية
  
  // ============================================
  // Reducers - معالجات Actions العادية
  // ============================================
  // Reducers هي دوال تحدث State بناءً على Actions
  // 
  // مثال:
  // dispatch(setUser({ id: '123', email: '...' }))
  //   ↓
  // setUser reducer يعمل → state.user = action.payload
  reducers: {
    /**
     * Set User
     * تحديث بيانات المستخدم
     */
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      // حفظ في AsyncStorage
      AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(action.payload));
    },
    
    /**
     * Update User
     * تحديث جزء من بيانات المستخدم
     */
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(state.user));
      }
    },
    
    /**
     * Set Auth Data
     * حفظ بيانات المصادقة (لـ Social Login)
     */
    setAuthData: (state, action: PayloadAction<AuthResponse>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken || null;
      
      // حفظ في AsyncStorage
      AsyncStorage.multiSet([
        [STORAGE_KEYS.TOKEN, action.payload.token],
        [STORAGE_KEYS.USER, JSON.stringify(action.payload.user)],
      
      ]);
    },
    
    /**
     * Clear Error
     * مسح رسالة الخطأ
     */
    clearError: (state) => {
      state.error = null;
    },
    
    /**
     * Reset Auth State
     * إعادة تعيين حالة المصادقة
     */
    resetAuth: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.error = null;
    },
  },
  
  // ============================================
  // Extra Reducers - معالجات Async Thunks
  // ============================================
  // Extra Reducers تعالج Actions من Async Thunks
  // 
  // لكل Async Thunk، هناك 3 حالات:
  // 1. pending: قبل بدء الاستدعاء
  // 2. fulfilled: عند النجاح
  // 3. rejected: عند الفشل
  extraReducers: (builder) => {
    // ============================================
    // Login Cases
    // ============================================
    builder
      // قبل بدء Login
      .addCase(loginAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      // عند نجاح Login
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken || null;
        state.error = null;
      })
      // عند فشل Login
      .addCase(loginAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
    
    // ============================================
    // Register Cases
    // ============================================
    builder
      .addCase(registerAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerAsync.fulfilled, (state) => {
        // لا نحفظ البيانات في Redux state عند Registration
        // المستخدم يجب أن يسجل دخول يدوياً بعد إنشاء الحساب
        state.isLoading = false;
        state.error = null;
      })
      .addCase(registerAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
    
    // ============================================
    // Logout Cases
    // ============================================
    builder
      .addCase(logoutAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutAsync.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.error = null;
      })
      .addCase(logoutAsync.rejected, (state) => {
        state.isLoading = false;
        // حتى لو فشل API، نكمل Logout محلياً
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.error = null;
      });
    
    // ============================================
    // Load Auth State Cases
    // ============================================
    builder
      .addCase(loadAuthStateAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loadAuthStateAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.refreshToken = action.payload.refreshToken;
        }
      })
      .addCase(loadAuthStateAsync.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

// ============================================
// Export Actions - تصدير Actions
// ============================================
// Actions هي دوال نستدعيها لتحديث State
// 
// مثال:
// dispatch(setUser({ id: '123', email: '...' }))
// dispatch(updateUser({ fullName: 'John' }))
export const { 
  setUser, 
  updateUser, 
  setAuthData, 
  clearError, 
  resetAuth 
} = authSlice.actions;

// ============================================
// Selectors - دوال لقراءة State
// ============================================
// Selectors هي دوال نستخدمها لقراءة State من Redux
// 
// مثال:
// const user = useSelector(selectUser);
// const isAuthenticated = useSelector(selectIsAuthenticated);
// 
// ملاحظة: نستخدم { auth: AuthState } لتجنب الاستيراد الدائري
// في useAuth.ts، سنستخدم RootState من store.ts
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectToken = (state: { auth: AuthState }) => state.auth.token;
export const selectIsLoading = (state: { auth: AuthState }) => state.auth.isLoading;
export const selectError = (state: { auth: AuthState }) => state.auth.error;
export const selectIsAuthenticated = (state: { auth: AuthState }) => 
  !!state.auth.token && !!state.auth.user;

// ============================================
// Export Reducer - تصدير Reducer
// ============================================
export default authSlice.reducer;
