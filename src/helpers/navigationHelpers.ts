/**
 * ============================================
 * 🚀 Quick Navigation Helper
 * ============================================
 * استخدم هذه الـ Functions للتنقل السريع
 */

import { ROUTES } from '../navigation/AppRoutes';

/**
 * التنقل إلى شاشة خطط الاشتراك
 * @param navigation - React Navigation object
 */
export const goToSubscriptionPlans = (navigation: any) => {
  navigation.navigate(ROUTES.SUBSCRIPTION_PLANS);
};

/**
 * التنقل إلى شاشة إضافة طريقة الدفع
 * @param navigation - React Navigation object
 */
export const goToAddPaymentMethod = (navigation: any) => {
  navigation.navigate(ROUTES.ADD_PAYMENT_METHOD);
};

/**
 * التنقل إلى شاشة كورساتي
 * @param navigation - React Navigation object
 */
export const goToMyCourses = (navigation: any) => {
  navigation.navigate(ROUTES.MY_COURSES);
};

/**
 * التحقق من الاشتراك وإظهار شاشة الاشتراكات إذا لزم
 * @param navigation - React Navigation object
 * @param isPremiumUser - هل المستخدم لديه اشتراك
 * @param onSuccess - Function تنفذ إذا كان مشترك
 */
export const checkSubscriptionAndNavigate = (
  navigation: any,
  isPremiumUser: boolean,
  onSuccess?: () => void
) => {
  if (isPremiumUser) {
    onSuccess?.();
  } else {
    goToSubscriptionPlans(navigation);
  }
};

// ============================================
// 📝 أمثلة الاستخدام:
// ============================================

/*
// مثال 1: استخدام بسيط
import { goToSubscriptionPlans } from '../helpers/navigationHelpers';

const MyComponent = ({ navigation }) => {
  return (
    <TouchableOpacity onPress={() => goToSubscriptionPlans(navigation)}>
      <Text>Upgrade to Premium</Text>
    </TouchableOpacity>
  );
};

// مثال 2: التحقق من الاشتراك
import { checkSubscriptionAndNavigate } from '../helpers/navigationHelpers';

const CourseCard = ({ navigation, course, isPremium }) => {
  const handleEnroll = () => {
    checkSubscriptionAndNavigate(
      navigation,
      isPremium,
      () => {
        // المستخدم مشترك - استمر في التسجيل
        console.log('User is premium, proceeding...');
      }
    );
  };

  return (
    <TouchableOpacity onPress={handleEnroll}>
      <Text>Enroll Now</Text>
    </TouchableOpacity>
  );
};

// مثال 3: استخدام متقدم مع شروط
const ProfileScreen = ({ navigation, user }) => {
  const handleUpgrade = () => {
    if (!user.isSubscribed) {
      goToSubscriptionPlans(navigation);
    } else {
      // المستخدم بالفعل مشترك
      Alert.alert('Already Premium', 'You are already a premium member!');
    }
  };

  return (
    <TouchableOpacity onPress={handleUpgrade}>
      <Text>Manage Subscription</Text>
    </TouchableOpacity>
  );
};
*/

