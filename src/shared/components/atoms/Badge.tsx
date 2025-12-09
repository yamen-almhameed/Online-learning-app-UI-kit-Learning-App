// ============================================
// Badge Component - Status/notification badge
// ============================================

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../../core/hooks/useTheme';
import { Text } from './Text';
import { BorderRadius } from '../../../core/theme/radius';
import { Spacing } from '../../../core/theme/spacing';

// Types
type BadgeVariant = 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
type BadgeSize = 'small' | 'medium' | 'large';

interface BadgeProps {
  text?: string;
  count?: number;
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  text,
  count,
  variant = 'primary',
  size = 'medium',
  dot = false,
  style,
}) => {
  const { theme } = useTheme();

  // Size styles
  const sizeStyles: Record<BadgeSize, { height: number; minWidth: number; fontSize: number; padding: number }> = {
    small: { height: 18, minWidth: 18, fontSize: 10, padding: 4 },
    medium: { height: 22, minWidth: 22, fontSize: 12, padding: 6 },
    large: { height: 28, minWidth: 28, fontSize: 14, padding: 8 },
  };

  // Variant colors
  const variantColors: Record<BadgeVariant, { bg: string; text: string }> = {
    primary: { bg: theme.colors.primary, text: theme.colors.textWhite },
    secondary: { bg: theme.colors.secondary, text: theme.colors.textWhite },
    success: { bg: theme.colors.success, text: theme.colors.textWhite },
    error: { bg: theme.colors.error, text: theme.colors.textWhite },
    warning: { bg: theme.colors.warning, text: theme.colors.textPrimary },
    info: { bg: theme.colors.info, text: theme.colors.textWhite },
  };

  const currentSize = sizeStyles[size];
  const currentColors = variantColors[variant];

  // Dot badge
  if (dot) {
    return (
      <View
        style={[
          styles.dot,
          {
            backgroundColor: currentColors.bg,
            width: size === 'small' ? 8 : size === 'medium' ? 10 : 12,
            height: size === 'small' ? 8 : size === 'medium' ? 10 : 12,
          },
          style,
        ]}
      />
    );
  }

  // Display text or count
  const displayText = text || (count !== undefined ? (count > 99 ? '99+' : count.toString()) : '');

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: currentColors.bg,
          height: currentSize.height,
          minWidth: currentSize.minWidth,
          paddingHorizontal: displayText.length > 1 ? currentSize.padding : 0,
        },
        style,
      ]}
    >
      <Text
        style={{
          color: currentColors.text,
          fontSize: currentSize.fontSize,
          fontWeight: '600',
        }}
      >
        {displayText}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.badge,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    borderRadius: BorderRadius.badge,
  },
});

export default Badge;

