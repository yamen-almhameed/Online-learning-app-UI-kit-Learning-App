// ============================================
// 🔷 Navigation Types - أنواع التنقل
// ============================================

import { NativeStackScreenProps } from '@react-navigation/native-stack';

// ============================================
// Auth Stack - شاشات المصادقة
// ============================================
export type AuthStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Login: undefined;
  SignUp: undefined;
};

// ============================================
// Home Stack - شاشات الرئيسية
// ============================================
export type HomeStackParamList = {
  Home: undefined;
  Search: { initialQuery?: string };
  CoursePlayer: { courseId: string };
  SubscriptionPlans: undefined;
  AddPaymentMethod: { planId?: string };
  MyCourses: undefined;
  Profile: undefined;
};

// ============================================
// Tab Navigator - شاشات التبويبات
// ============================================
export type TabParamList = {
  HomeTab: undefined;
  SearchTab: undefined;
  CoursesTab: undefined;
  ProfileTab: undefined;
};

// ============================================
// Root Stack - الجذر
// ============================================
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

// ============================================
// Screen Props - أنواع الشاشات
// ============================================
export type SplashScreenProps = NativeStackScreenProps<AuthStackParamList, 'Splash'>;
export type OnboardingScreenProps = NativeStackScreenProps<AuthStackParamList, 'Onboarding'>;
export type LoginScreenProps = NativeStackScreenProps<AuthStackParamList, 'Login'>;
export type SignUpScreenProps = NativeStackScreenProps<AuthStackParamList, 'SignUp'>;
export type HomeScreenProps = NativeStackScreenProps<HomeStackParamList, 'Home'>;
export type SearchScreenProps = NativeStackScreenProps<HomeStackParamList, 'Search'>;
export type CoursePlayerScreenProps = NativeStackScreenProps<HomeStackParamList, 'CoursePlayer'>;
export type SubscriptionPlansScreenProps = NativeStackScreenProps<HomeStackParamList, 'SubscriptionPlans'>;
export type AddPaymentMethodScreenProps = NativeStackScreenProps<HomeStackParamList, 'AddPaymentMethod'>;
export type MyCoursesScreenProps = NativeStackScreenProps<HomeStackParamList, 'MyCourses'>;
export type ProfileScreenProps = NativeStackScreenProps<HomeStackParamList, 'Profile'>;
