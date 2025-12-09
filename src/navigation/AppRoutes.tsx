import React, { createContext, useContext, useState, useEffect } from 'react';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../core/hooks/useAuth';
import { useTheme } from '../core/hooks/useTheme';
import type { 
  AuthStackParamList, 
  HomeStackParamList, 
  RootStackParamList,
  TabParamList 
} from './types';

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

export const ROUTES = {
  SPLASH: 'Splash',
  ONBOARDING: 'Onboarding',
  LOGIN: 'Login',
  SIGN_UP: 'SignUp',
  AUTH: 'Auth',
  MAIN: 'Main',
  HOME: 'Home',
  SEARCH: 'Search',
  MY_COURSES: 'MyCourses',
  PROFILE: 'Profile',
  COURSE_PLAYER: 'CoursePlayer',
  SUBSCRIPTION_PLANS: 'SubscriptionPlans',
  ADD_PAYMENT_METHOD: 'AddPaymentMethod',
  HOME_TAB: 'HomeTab',
  SEARCH_TAB: 'SearchTab',
  COURSES_TAB: 'CoursesTab',
  PROFILE_TAB: 'ProfileTab',
} as const;

interface NavStateType {
  hasCompletedOnboarding: boolean;
  setOnboardingCompleted: () => Promise<void>;
}

const NavStateContext = createContext<NavStateType | null>(null);

export const useNavigationState = () => {
  const context = useContext(NavStateContext);
  if (!context) {
    throw new Error('useNavigationState must be used within NavigationStateProvider');
  }
  return context;
};

export const NavigationStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  useEffect(() => {
    const checkOnboarding = async () => {
      const value = await AsyncStorage.getItem('onboarding_completed');
      setHasCompletedOnboarding(value === 'true');
    };
    checkOnboarding();
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

const RootStack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();

const HomeStackNavigator = () => (
  <HomeStack.Navigator screenOptions={{ headerShown: false }}>
    <HomeStack.Screen name={ROUTES.HOME} component={HomeScreen as any} />
    <HomeStack.Screen name={ROUTES.SEARCH} component={SearchScreen as any} />
    <HomeStack.Screen name={ROUTES.COURSE_PLAYER} component={CoursePlayerScreen as any} />
    <HomeStack.Screen name={ROUTES.SUBSCRIPTION_PLANS} component={SubscriptionPlansScreen as any} />
    <HomeStack.Screen name={ROUTES.ADD_PAYMENT_METHOD} component={AddPaymentMethodScreen as any} />
  </HomeStack.Navigator>
);

const TabIcon = ({ icon, label, focused }: { icon: string; label: string; focused: boolean }) => {
  const { theme } = useTheme();
  
  return (
    <View style={styles.tabIcon}>
      <Text style={{ fontSize: 24, opacity: focused ? 1 : 0.5 }}>{icon}</Text>
      <Text style={{ 
        fontSize: 10, 
        color: focused ? theme.colors.primary : '#999', 
        marginTop: 2 
      }}>
        {label}
      </Text>
    </View>
  );
};

const MainTabs = () => {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: theme.colors.tabBarBackground || '#FFFFFF',
          height: 70,
          paddingBottom: 10,
          borderTopWidth: 1,
          borderTopColor: theme.colors.border || '#E0E0E0',
        },
      }}
    >
      <Tab.Screen
        name={ROUTES.HOME_TAB}
        component={HomeStackNavigator}
        options={{ 
          tabBarIcon: ({ focused }) => <TabIcon icon="🏠" label="Home" focused={focused} /> 
        }}
      />
      <Tab.Screen
        name={ROUTES.SEARCH_TAB}
        component={SearchScreen as any}
        options={{ 
          tabBarIcon: ({ focused }) => <TabIcon icon="🔍" label="Search" focused={focused} /> 
        }}
      />
      <Tab.Screen
        name={ROUTES.COURSES_TAB}
        component={MyCoursesScreen as any}
        options={{ 
          tabBarIcon: ({ focused }) => <TabIcon icon="📚" label="Courses" focused={focused} /> 
        }}
      />
      <Tab.Screen
        name={ROUTES.PROFILE_TAB}
        component={ProfileScreen as any}
        options={{ 
          tabBarIcon: ({ focused }) => <TabIcon icon="👤" label="Profile" focused={focused} /> 
        }}
      />
    </Tab.Navigator>
  );
};

const AuthNavigator = () => (
  <AuthStack.Navigator
    initialRouteName={ROUTES.SPLASH}
    screenOptions={{ 
      headerShown: false, 
      animation: 'slide_from_right' 
    }}
  >
    <AuthStack.Screen name={ROUTES.SPLASH} component={SplashScreen as any} />
    <AuthStack.Screen name={ROUTES.ONBOARDING} component={OnboardingScreen as any} />
    <AuthStack.Screen name={ROUTES.LOGIN} component={LoginScreen as any} />
    <AuthStack.Screen name={ROUTES.SIGN_UP} component={SignUpScreen as any} />
  </AuthStack.Navigator>
);

export const AppRoutes = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const { theme } = useTheme();

  if (isLoading) {
    return (
      <View style={[styles.loading, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.textPrimary }]}>
          Loading...
        </Text>
      </View>
    );
  }

  return (
    <RootStack.Navigator 
      screenOptions={{ headerShown: false }}
    >
      {isAuthenticated ? (
        <RootStack.Screen name={ROUTES.MAIN} component={MainTabs} />
      ) : (
        <RootStack.Screen name={ROUTES.AUTH} component={AuthNavigator} />
      )}
    </RootStack.Navigator>
  );
};

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  tabIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AppRoutes;
