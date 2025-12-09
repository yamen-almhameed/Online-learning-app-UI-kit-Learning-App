// ============================================
// OnboardingSlide Component - Onboarding screen slide
// ============================================

import React from 'react';
import { View, StyleSheet, Image, ImageSourcePropType, Dimensions } from 'react-native';
import { useTheme } from '../../../core/hooks/useTheme';
import { Text } from '../atoms/Text';
import { Spacing } from '../../../core/theme/spacing';
import { BorderRadius } from '../../../core/theme/radius';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Types
interface OnboardingSlideProps {
  title: string;
  highlight: string;
  description: string;
  image: ImageSourcePropType;
  backgroundColor?: string;
}

export const OnboardingSlide: React.FC<OnboardingSlideProps> = ({
  title,
  highlight,
  description,
  image,
  backgroundColor,
}) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { width: SCREEN_WIDTH }]}>
      {/* Image Container */}
      <View
        style={[
          styles.imageContainer,
          { backgroundColor: backgroundColor || theme.colors.onboarding1 },
        ]}
      >
        <Image
          source={image}
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text variant="h3" color={theme.colors.textPrimary}>
          {title}
        </Text>
        <Text
          variant="h2"
          color={theme.colors.primary}
          weight="extraBold"
          style={styles.highlight}
        >
          {highlight}
        </Text>
        <Text
          variant="bodyLarge"
          color={theme.colors.textSecondary}
          style={styles.description}
        >
          {description}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    height: SCREEN_HEIGHT * 0.5,
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.xl,
    borderRadius: BorderRadius.cardLarge,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '90%',
    height: '90%',
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xxl,
  },
  highlight: {
    marginTop: Spacing.xs,
  },
  description: {
    marginTop: Spacing.md,
    lineHeight: 26,
  },
});

export default OnboardingSlide;

