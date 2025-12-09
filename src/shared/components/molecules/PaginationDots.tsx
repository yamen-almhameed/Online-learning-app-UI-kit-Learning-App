// ============================================
// PaginationDots Component - Carousel/Onboarding dots
// ============================================

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../../core/hooks/useTheme';
import { Spacing } from '../../../core/theme/spacing';

// Types
interface PaginationDotsProps {
  total: number;
  activeIndex: number;
  activeColor?: string;
  inactiveColor?: string;
  dotSize?: number;
  activeDotWidth?: number;
  spacing?: number;
  style?: ViewStyle;
}

export const PaginationDots: React.FC<PaginationDotsProps> = ({
  total,
  activeIndex,
  activeColor,
  inactiveColor,
  dotSize = 8,
  activeDotWidth = 24,
  spacing = Spacing.sm,
  style,
}) => {
  const { theme } = useTheme();

  const activeDotColor = activeColor || theme.colors.primary;
  const inactiveDotColor = inactiveColor || theme.colors.border;

  return (
    <View style={[styles.container, style]}>
      {Array.from({ length: total }).map((_, index) => {
        const isActive = index === activeIndex;
        
        return (
          <View
            key={index}
            style={[
              styles.dot,
              {
                width: isActive ? activeDotWidth : dotSize,
                height: dotSize,
                borderRadius: dotSize / 2,
                backgroundColor: isActive ? activeDotColor : inactiveDotColor,
                marginHorizontal: spacing / 2,
              },
            ]}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    // Base styles
  },
});

export default PaginationDots;

