import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  Image,
} from 'react-native';
import { useTheme } from '../../../core/hooks/useTheme';
import { useNavigationState, ROUTES } from '../../../navigation';
import { Text } from '../../../shared/components/atoms/Text';
import { Button } from '../../../shared/components/atoms/Button';
import { Spacer } from '../../../shared/components/atoms/Spacer';
import { PaginationDots } from '../../../shared/components/molecules/PaginationDots';
import { Spacing } from '../../../core/theme/spacing';
import { BorderRadius } from '../../../core/theme/radius';
import { OnboardingScreenProps } from '../../../navigation/types';
import { Colors, FontWeights } from '../../../core/theme';
import { OnboardingImages } from '../../../shared/assets/image';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// ============================================
// 4 شاشات Onboarding حسب التصميم
// ============================================
const SLIDES = [
  {
    id: '1',
    image: OnboardingImages.slide1,
    title: 'Welcome to',
    highlight: 'SALFORD',
    description: 'Unlock the best IT courses for your career growth.',
    backgroundColor: '#D4F5E9', // أخضر فاتح (mint)
  },
  {
    id: '2',
    image: OnboardingImages.slide2,
    title: 'Explore a wide range of',
    highlight: 'IT Courses',
    description: 'From coding to\ncybersecurity, we have it all!',
    backgroundColor: '#FFE4D6', // خوخي (peach)
  },
  {
    id: '3',
    image: OnboardingImages.slide3,
    title: 'Learn on your own',
    highlight: 'Schedule',
    description: 'Access courses on the go, anytime, from anywhere.',
    backgroundColor: '#D6EAF8', // أزرق فاتح
  },
  {
    id: '4',
    image: OnboardingImages.slide4, // ⚠️ تحتاج صورة القبعات هنا
    title: 'Ready to dive into',
    highlight: 'Learning?',
    description: 'Access courses on the go, anytime, from anywhere.',
    backgroundColor: '#D6EAF8', // أزرق فاتح
  },
];

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const { setOnboardingCompleted } = useNavigationState();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const isLastSlide = currentIndex === SLIDES.length - 1;

  const handleScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / SCREEN_WIDTH);
    setCurrentIndex(index);
  };

  const handleNext = async () => {
    if (isLastSlide) {
      await completeOnboarding();
    } else {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    }
  };

  const handleSkip = async () => {
    await setOnboardingCompleted();
    // الانتقال مباشرة لشاشة تسجيل الدخول
    navigation.replace(ROUTES.LOGIN);
  };

  const completeOnboarding = async () => {
    await setOnboardingCompleted();
    navigation.replace(ROUTES.LOGIN);
  };

  // عرض كل slide
  const renderSlide = ({ item, index }: { item: typeof SLIDES[0]; index: number }) => {
    const isSpecialSlide = index === 0 || index === 3;
    
    return (
      <View style={[styles.slide, { width: SCREEN_WIDTH }]}>
        {/* حاوية الصورة */}
        <View style={[
         styles.imageContainerSpecial,
        ]}>
          <Image
            source={item.image}
            style={styles.imageSpecial}
            resizeMode="contain"
          />
        </View>

        {/* المحتوى */}
        <View style={styles.content}>
          <Text style={styles.welcomeText}>
            {item.title}
          </Text>
          <Text color={Colors.accent} style={styles.brandText}>
            {item.highlight}
          </Text>
          <Text variant="body" color={Colors.textSecondary} style={styles.descriptionSpecial}>
            {item.description}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />

      <FlatList
        ref={flatListRef}
        data={SLIDES}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        bounces={false}
      />

      {/* القسم السفلي للشاشات الخاصة (0 و 3) */}
      {(currentIndex === 0 || currentIndex === 3) && (
        <View style={styles.bottomSection}>
          <View style={styles.specialButtonContainer}>
            <Button
              title={currentIndex === 0 ? "Get Started" : "Start Learning"}
              onPress={handleNext}
              size="large"
              gradientColors={['#087E8B', '#0B3954']}
              style={styles.specialButton}
              textStyle={styles.specialButtonText}
            />
          </View>
          <Spacer size="huge" />
        </View>
      )}

      {/* شريط التنقل للشاشات الوسطى (1 و 2) - في أسفل الشاشة */}
      {(currentIndex === 1 || currentIndex === 2) && (
        <View style={styles.bottomNavigationRow}>
          <TouchableOpacity onPress={handleSkip}>
            <Text variant="body" color={theme.colors.textSecondary}>
              Skip
            </Text>
          </TouchableOpacity>

          <PaginationDots total={3} activeIndex={currentIndex} />

          <TouchableOpacity onPress={handleNext}>
            <Text variant="body" color={theme.colors.primary} weight="semiBold">
              Next
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  slide: {
    flex: 1,
  },
  // تصميم الشاشات الوسطى (1 و 2)
  imageContainer: {
    height: SCREEN_HEIGHT * 0.55,
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.md,
    borderRadius: BorderRadius.cardLarge,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '85%',
    height: '85%',
  },
  // تصميم الشاشات الخاصة (0 و 3)
  imageContainerSpecial: {
    height: SCREEN_HEIGHT * 0.55,
    marginHorizontal: 8,
    marginTop: 30,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  imageSpecial: {
    width: '95%',
    height: '95%',
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
  },
  highlight: {
    marginTop: 4,
  },
  description: {
    marginTop: Spacing.sm,
    lineHeight: 22,
  },
  // نصوص الشاشات الخاصة
  welcomeText: {
    fontSize: 26,
    marginBottom: 4,
    fontFamily: 'ClashDisplay-Regular',
    fontWeight: FontWeights.medium,
    color: Colors.black,
    verticalAlign: 'middle',
  },
  brandText: {
    fontSize: 53,
    letterSpacing: 2,
    fontFamily: 'ClashDisplay-Bold',
    lineHeight: 56,
  },
  descriptionSpecial: {
    lineHeight: 24,
    fontSize: 19,
    fontFamily: 'Montserrat-Regular',
    color: Colors.textSecondary,
  },
  bottomSection: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.md,
  },
  navigationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  bottomNavigationRow: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xxl,
  },
  startButtonContainer: {
    paddingVertical: Spacing.md,
  },
  // زر الشاشات الخاصة
  specialButtonContainer: {
    paddingVertical: Spacing.md,
  },
  specialButton: {
    borderRadius: 30,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignSelf: 'flex-start',
    minWidth: 160,
  },
  specialButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600' as const,
    fontFamily: 'Montserrat-SemiBold',
  },
});

export default OnboardingScreen;
