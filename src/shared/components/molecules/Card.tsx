// ============================================
// Card Component - Reusable card container
// ============================================

import React from 'react';
import { View, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import { useTheme } from '../../../core/hooks/useTheme';
import { BorderRadius } from '../../../core/theme/radius';
import { Spacing } from '../../../core/theme/spacing';
import { ComponentShadows } from '../../../core/theme/shadows';

// Types
interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: 'elevated' | 'outlined' | 'filled';
  padding?: 'none' | 'small' | 'medium' | 'large';
  radius?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
  disabled?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  onPress,
  variant = 'elevated',
  padding = 'medium',
  radius = 'medium',
  style,
  disabled = false,
}) => {
  const { theme } = useTheme();

  // Padding values
  const paddingValues = {
    none: 0,
    small: Spacing.sm,
    medium: Spacing.base,
    large: Spacing.xl,
  };

  // Radius values
  const radiusValues = {
    small: BorderRadius.card,
    medium: BorderRadius.cardLarge,
    large: BorderRadius.modal,
  };

  // Get variant styles
  const getVariantStyles = (): ViewStyle => {
    switch (variant) {
      case 'elevated':
        return {
          backgroundColor: theme.colors.card,
          ...ComponentShadows.card,
        };
      case 'outlined':
        return {
          backgroundColor: theme.colors.card,
          borderWidth: 1,
          borderColor: theme.colors.border,
        };
      case 'filled':
        return {
          backgroundColor: theme.colors.cardLight,
        };
      default:
        return {
          backgroundColor: theme.colors.card,
        };
    }
  };

  const cardStyle: ViewStyle = {
    padding: paddingValues[padding],
    borderRadius: radiusValues[radius],
    ...getVariantStyles(),
    opacity: disabled ? 0.5 : 1,
    ...style,
  };

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        disabled={disabled}
        style={cardStyle}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={cardStyle}>{children}</View>;
};

export default Card;

