import React, { createContext, useContext, useState, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { CommonActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { navigationRef } from '../App';
import SplashScreen from '../features/auth/screens/SplashScreen';
import LoginScreen from '../features/auth/screens/LoginScreen';
import SignUpScreen from '../features/auth/screens/SignUpScreen';
import OnboardingScreen from '../features/onboarding/screens/OnboardingScreen';
import HomeScreen from '../features/home/screens/HomeScreen';
import SearchScreen from '../features/home/screens/SearchScreen';
import CoursePlayerScreen from '../features/courses/screens/CoursePlayerScreen';
import MyCoursesScreen from '../features/courses/screens/MyCoursesScreen';
import ProfileScreen from '../features/profile/screens/ProfileScreen';
import SubscriptionPlansScreen from '../features/payment/screens/SubscriptionPlansScreen';
import AddPaymentMethodScreen from '../features/payment/screens/AddPaymentMethodScreen';
import { useAuth } from '../core/hooks/useAuth';
import { useTheme } from '../core/hooks/useTheme';
export const ROUTES = {
  // Auth
  SPLASH: 'Splash',
  ONBOARDING: 'Onboarding',
  LOGIN: 'Login',
  SIGN_UP: 'SignUp',
  // Main
  AUTH: 'Auth',
  MAIN: 'Main',
  HOME: 'Home',
  SEARCH: 'Search',
  MY_COURSES: 'MyCourses',
  PROFILE: 'Profile',
  COURSE_PLAYER: 'CoursePlayer',
  // Payment
  SUBSCRIPTION_PLANS: 'SubscriptionPlans',
  ADD_PAYMENT_METHOD: 'AddPaymentMethod',
} as const;

interface NavStateType {
  hasCompletedOnboarding: boolean;
  setOnboardingCompleted: () => Promise<void>;
}

const NavStateContext = createContext<NavStateType | null>(null);

export const useNavigationState = () => {
  const context = useContext(NavStateContext);
  if (!context) throw new Error('useNavigationState must be inside Provider');
  return context;
};

export const NavigationStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('onboarding_completed').then(value => {
      setHasCompletedOnboarding(value === 'true');
    });
  }, []);

  const setOnboardingCompleted = async () => {
    await AsyncStorage.setItem('onboarding_completed', 'true');
    setHasCompletedOnboarding(true);
  };

  return (
    <NavStateContext.Provider value={{ hasCompletedOnboarding, setOnboardingCompleted }}>
      {children}
    </NavStateContext.Provider>
  );
};

const RootStack = createNativeStackNavigator();
const AuthStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();

const HomeStackNavigator = () => (
  <HomeStack.Navigator screenOptions={{ headerShown: false }}>
    <HomeStack.Screen name={ROUTES.HOME} component={HomeScreen as any} />
    <HomeStack.Screen name={ROUTES.SEARCH} component={SearchScreen as any} />
    <HomeStack.Screen name={ROUTES.COURSE_PLAYER} component={CoursePlayerScreen as any} />
    <HomeStack.Screen name={ROUTES.MY_COURSES} component={MyCoursesScreen as any} />
    <HomeStack.Screen name={ROUTES.PROFILE} component={ProfileScreen as any} />
    <HomeStack.Screen name={ROUTES.SUBSCRIPTION_PLANS} component={SubscriptionPlansScreen as any} />
    <HomeStack.Screen name={ROUTES.ADD_PAYMENT_METHOD} component={AddPaymentMethodScreen as any} />
  </HomeStack.Navigator>
);

const TabIcon = ({ icon, label, focused }: { icon: string; label: string; focused: boolean }) => (
  <View style={styles.tabIcon}>
    <Text style={{ fontSize: 24, opacity: focused ? 1 : 0.5 }}>{icon}</Text>
    <Text style={{ fontSize: 10, color: focused ? '#FF6B35' : '#999', marginTop: 2 }}>{label}</Text>
  </View>
);

const MainTabs = () => {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: theme.colors.tabBarBackground,
          height: 70,
          paddingBottom: 10,
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStackNavigator}
        options={{ tabBarIcon: ({ focused }) => <TabIcon icon="🏠" label="Home" focused={focused} /> }}
      />
      <Tab.Screen
        name="SearchTab"
        component={SearchScreen as any}
        options={{ tabBarIcon: ({ focused }) => <TabIcon icon="🔍" label="Search" focused={focused} /> }}
      />
      <Tab.Screen
        name="CoursesTab"
        component={MyCoursesScreen as any}
        options={{ tabBarIcon: ({ focused }) => <TabIcon icon="📚" label="Courses" focused={focused} /> }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen as any}
        options={{ tabBarIcon: ({ focused }) => <TabIcon icon="👤" label="Profile" focused={focused} /> }}
      />
    </Tab.Navigator>
  );
};

// ============================================
// 🔐 Auth Navigator (قبل تسجيل الدخول)
// ============================================
const AuthNavigator = () => {
  const [hasSeenSplash, setHasSeenSplash] = React.useState(false);
  const [initialRoute, setInitialRoute] = React.useState<string>(ROUTES.SPLASH);

  React.useEffect(() => {
    // التحقق من AsyncStorage لمعرفة إذا كان المستخدم قد رأى Splash من قبل
    AsyncStorage.getItem('has_seen_splash').then(value => {
      if (value === 'true') {
        // إذا رأى Splash من قبل، ابدأ مباشرة من Login أو Onboarding
        AsyncStorage.getItem('onboarding_completed').then(onboardingValue => {
          setInitialRoute(onboardingValue === 'true' ? ROUTES.LOGIN : ROUTES.ONBOARDING);
          setHasSeenSplash(true);
        });
      } else {
        // أول مرة - ابدأ من Splash
        setInitialRoute(ROUTES.SPLASH);
        setHasSeenSplash(true);
      }
    });
  }, []);

  if (!hasSeenSplash) {
    // انتظر حتى نعرف الـ initial route
    return null;
  }

  return (
    <AuthStack.Navigator
      initialRouteName={initialRoute}
      screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
    >
      <AuthStack.Screen name="Splash" component={SplashScreen as any} />
      <AuthStack.Screen name="Onboarding" component={OnboardingScreen as any} />
      <AuthStack.Screen name="Login" component={LoginScreen as any} />
      <AuthStack.Screen name="SignUp" component={SignUpScreen as any} />
    </AuthStack.Navigator>
  );
};

export const AppRoutes = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [initialRouteName] = React.useState(() => {
    const route = isAuthenticated ? ROUTES.MAIN : ROUTES.AUTH;
    console.log('🔴 [AppRoutes] initialRouteName:', route, 'isAuthenticated:', isAuthenticated);
    return route;
  });

  const lastAuthStateRef = React.useRef<boolean | null>(null);

  React.useEffect(() => {
    console.log('🔴 [AppRoutes] isAuthenticated تغير:', isAuthenticated);
    console.log('🔴 [AppRoutes] isLoading:', isLoading);
  }, [isAuthenticated, isLoading]);

  React.useEffect(() => {
    if (isLoading) {
      return;
    }

    // Wait for navigation to be ready
    const checkNavigationReady = () => {
      if (!navigationRef.isReady()) {
        console.log('🔴 [AppRoutes] Navigation ليس جاهز بعد...');
        // Retry after a short delay
        setTimeout(checkNavigationReady, 100);
        return;
      }

      // Only navigate if auth state actually changed
      if (lastAuthStateRef.current === isAuthenticated) {
        return;
      }

      lastAuthStateRef.current = isAuthenticated;

      try {
        if (isAuthenticated) {
          console.log('🔴 [AppRoutes] المستخدم مسجل دخول - الانتقال إلى MAIN');
          navigationRef.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: ROUTES.MAIN }],
            })
          );
        } else {
          // عند تسجيل الخروج، انتقل مباشرة إلى Login (وليس AUTH الذي يبدأ بـ Splash)
          console.log('🔴 [AppRoutes] المستخدم غير مسجل دخول - الانتقال إلى Login');
          navigationRef.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: ROUTES.AUTH, params: { screen: ROUTES.LOGIN } }],
            })
          );
        }
      } catch (error) {
        console.error('❌ [AppRoutes] Navigation error:', error);
      }
    };

    checkNavigationReady();
  }, [isAuthenticated, isLoading]);

  if (isLoading) {
    console.log('🔴 [AppRoutes] Loading...');
    return (
      <View style={styles.loading}>
        <Text>Loading...</Text>
      </View>
    );
  }

  console.log('🔴 [AppRoutes] Render - initialRouteName:', initialRouteName);

  return (
    <RootStack.Navigator 
      initialRouteName={initialRouteName}
      screenOptions={{ headerShown: false }}
    >
      <RootStack.Screen name={ROUTES.AUTH} component={AuthNavigator} />
      <RootStack.Screen name={ROUTES.MAIN} component={HomeStackNavigator} />
      {/* Removed duplicate screens - they are already in HomeStackNavigator */}
    </RootStack.Navigator>
  );
};

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AppRoutes;
