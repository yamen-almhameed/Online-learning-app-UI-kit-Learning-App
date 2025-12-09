// ============================================
// API Services Index
// ============================================

export { AuthService } from './AuthService';
export type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  User,
  SocialLoginRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  VerifyOtpRequest,
} from './AuthService';

export { CourseService } from './CourseService';
export type {
  Course,
  Instructor,
  Lesson,
  Chapter,
  CourseDetails,
  Review,
  UserCourse,
  CourseFilters,
  CoursesResponse,
} from './CourseService';

export { SubscriptionService } from './SubscriptionService';
export type {
  SubscriptionPlan,
  SubscriptionPlansResponse,
} from './SubscriptionService';

