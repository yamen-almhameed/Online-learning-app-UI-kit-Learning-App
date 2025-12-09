// ============================================
// Assets Index - Export all images
// ============================================

// Splash Screen
export const SplashImages = {
  logo: require('./logo 2.png'),
  bubbleBig: require('./bubbleBig_splash.png.png'),
  bubbleMid: require('./bubblemid_splash.png.png'),
  bubbleSmall: require('./bubblesmall_splash.png'),
};

// Onboarding Images (4 شاشات)
export const OnboardingImages = {
  slide1: require('./阅读扁平矢量人物插画阅读28果冻_画板 1.png'),      // Welcome - بنت مع لابتوب
  slide2: require('./阅读扁平矢量人物插画阅读28果冻_画板 1 (1).png'),  // IT Courses - بنت على مكتب
  slide3: require('./阅读扁平矢量人物插画阅读28果冻_画板 1 (2).png'),  // Schedule - بنت مع كونفيتي
  slide4: require('./阅读扁平矢量人物插画阅读28果冻_画板 1 (3).png'),  // ⚠️ مؤقت - تحتاج صورة القبعات
};

// App Logo
export const AppLogo = require('./logo 2.png');

export default {
  splash: SplashImages,
  onboarding: OnboardingImages,
  logo: AppLogo,
};
