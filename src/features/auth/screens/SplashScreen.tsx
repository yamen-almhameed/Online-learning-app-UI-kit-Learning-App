import * as React from 'react';
import { useEffect, useRef, useCallback } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  Animated,
  Image,
  Dimensions,
} from 'react-native';
import { useTheme } from '../../../core/hooks/useTheme';
import { useAuth } from '../../../core/hooks/useAuth';
import { useNavigationState, ROUTES } from '../../../navigation';
import { SplashScreenProps } from '../../../navigation/types';
import { Colors } from '../../../core/theme/colors';
import { SplashImages } from '../../../shared/assets/image';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const SplashScreen: React.FC<SplashScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const { isAuthenticated } = useAuth();
  const { hasCompletedOnboarding } = useNavigationState();

  // Animation values
  const logoFade = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.5)).current;
  const bubbleBigAnim = useRef(new Animated.Value(150)).current;
  const bubbleMidAnim = useRef(new Animated.Value(150)).current;
  const bubbleSmallAnim = useRef(new Animated.Value(150)).current;
  
  // حفظ أحدث قيمة للـ onboarding state
  const onboardingCompletedRef = useRef(hasCompletedOnboarding);
  
  // تحديث الـ ref لما تتغير القيمة
  useEffect(() => {
    onboardingCompletedRef.current = hasCompletedOnboarding;
  }, [hasCompletedOnboarding]);

  useEffect(() => {
    // حفظ أن المستخدم قد رأى Splash Screen
    AsyncStorage.setItem('has_seen_splash', 'true');

    startAnimations();

    // Navigate after delay
    const timer = setTimeout(() => {
      handleNavigation();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const startAnimations = () => {
    // Logo animation
    Animated.parallel([
      Animated.timing(logoFade, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // Bubbles animation (slide up with stagger)
    Animated.stagger(200, [
      Animated.spring(bubbleBigAnim, {
        toValue: 0,
        friction: 10,
        tension: 30,
        useNativeDriver: true,
      }),
      Animated.spring(bubbleMidAnim, {
        toValue: 0,
        friction: 10,
        tension: 30,
        useNativeDriver: true,
      }),
      Animated.spring(bubbleSmallAnim, {
        toValue: 0,
        friction: 10,
        tension: 30,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleNavigation = useCallback(() => {
    if (isAuthenticated) {
      return; // RootNavigator سينقله للـ Main
    }

    // تحقق إذا كمّل الـ Onboarding قبل (استخدم الـ ref للحصول على أحدث قيمة)
    if (onboardingCompletedRef.current) {
      navigation.replace(ROUTES.LOGIN);
    } else {
      navigation.replace(ROUTES.ONBOARDING);
    }
  }, [isAuthenticated, navigation]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF5F0" />

      {/* Logo */}
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: logoFade,
            transform: [{ scale: logoScale }],
          },
        ]}
      >
        <Image
          source={SplashImages.logo}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>

      {/* Bottom Bubbles/Waves */}
      <View style={styles.bubblesContainer}>
        {/* Big Bubble (Back - darkest) */}
        <Animated.View
          style={[
            styles.bubble,
            styles.bubbleBig,
            {
              backgroundColor: Colors.primary,
              transform: [{ translateY: bubbleBigAnim }],
            },
          ]}
        />

        {/* Mid Bubble */}
        <Animated.View
          style={[
            styles.bubble,
            styles.bubbleMid,
            {
              backgroundColor: Colors.primaryLight,
              transform: [{ translateY: bubbleMidAnim }],
            },
          ]}
        />

        {/* Small Bubble (Front - lightest) */}
        <Animated.View
          style={[
            styles.bubble,
            styles.bubbleSmall,
            {
              backgroundColor: Colors.primaryDark,
              transform: [{ translateY: bubbleSmallAnim }],
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAF5F0',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SCREEN_HEIGHT * 0.1,
  },
  logo: {
    width: SCREEN_WIDTH * 0.55,
    height: SCREEN_WIDTH * 0.65,
  },
  bubblesContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: SCREEN_HEIGHT * 0.28,
    overflow: 'hidden',
  },
  bubble: {
    position: 'absolute',
    borderTopLeftRadius: SCREEN_WIDTH,
    borderTopRightRadius: SCREEN_WIDTH,
  },
  bubbleBig: {
    bottom: -SCREEN_HEIGHT * 0.08,
    left: -SCREEN_WIDTH * 0.15,
    right: -SCREEN_WIDTH * 0.15,
    height: SCREEN_HEIGHT * 0.28,
    opacity: 1,
  },
  bubbleMid: {
    bottom: -SCREEN_HEIGHT * 0.06,
    left: -SCREEN_WIDTH * 0.05,
    right: -SCREEN_WIDTH * 0.05,
    height: SCREEN_HEIGHT * 0.22,
    opacity: 0.9,
  },
  bubbleSmall: {
    bottom: -SCREEN_HEIGHT * 0.04,
    left: SCREEN_WIDTH * 0.05,
    right: SCREEN_WIDTH * 0.05,
    height: SCREEN_HEIGHT * 0.16,
    opacity: 0.8,
  },
});

export default SplashScreen;
