// ============================================
// Button Component - Reusable button component
// ============================================

import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  View,
} from 'react-native';
import { useTheme } from '../../../core/hooks/useTheme';
import { Text } from './Text';
import { Spacing } from '../../../core/theme/spacing';
import { BorderRadius } from '../../../core/theme/radius';
import { ComponentShadows } from '../../../core/theme/shadows';
import LinearGradient from 'react-native-linear-gradient';

// Types
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'social';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  height?: number;
  gradient?: boolean;
  gradientColors?: string[];
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  style,
  textStyle,
  height = 60,
  gradient = false,
  gradientColors,
}) => {
  const { theme } = useTheme();

  // Size styles
  const sizeStyles: Record<ButtonSize, { height: number; paddingHorizontal: number; fontSize: number }> = {
    small: { height: 40, paddingHorizontal: Spacing.base, fontSize: 14 },
    medium: { height: 52, paddingHorizontal: Spacing.xl, fontSize: 16 },
    large: { height: 60, paddingHorizontal: Spacing.xxl, fontSize: 18 },
  };

  // Variant styles
  const getVariantStyles = (): { container: ViewStyle; text: TextStyle } => {
    switch (variant) {
      case 'primary':
        return {
          container: {
            backgroundColor: theme.colors.primary,
            ...ComponentShadows.button, 
          },
          text: {
            color: theme.colors.textWhite,
          },
        };
      case 'secondary':
        return {
          container: {
            backgroundColor: theme.colors.secondary,
          },
          text: {
            color: theme.colors.textWhite,
          },
        };
      case 'outline':
        return {
          container: {
            backgroundColor: 'transparent',
            borderWidth: 1.5,
            borderColor: theme.colors.primary,
          },
          text: {
            color: theme.colors.primary,
          },
        };
      case 'ghost':
        return {
          container: {
            backgroundColor: 'transparent',
          },
          text: {
            color: theme.colors.primary,
          },
        };
      case 'social':
        return {
          container: {
            backgroundColor: theme.colors.card,
            ...ComponentShadows.button,
          },
          text: {
            color: theme.colors.textPrimary,
          },
        };
      default:
        return {
          container: {
            backgroundColor: theme.colors.primary,
          },
          text: {
            color: theme.colors.textWhite,
          },
        };
    }
  };

  const variantStyles = getVariantStyles();
  const currentSize = sizeStyles[size];

  const containerStyle: ViewStyle = {
    height: height || currentSize.height,
    paddingHorizontal: currentSize.paddingHorizontal,
    borderRadius: BorderRadius.button,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: disabled ? 0.5 : 1,
    ...(fullWidth && { width: '100%' }),
    ...variantStyles.container,
    ...style,
  };

  const labelStyle: TextStyle = {
    fontSize: currentSize.fontSize,
    fontWeight: '600',
    ...variantStyles.text,
    ...textStyle,
  };

  const renderContent = () => (
    <>
      {loading ? (
        <ActivityIndicator 
          color={variantStyles.text.color} 
          size="small" 
        />
      ) : (
        <>
          {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
          <Text style={labelStyle}>{title}</Text>
          {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
        </>
      )}
    </>
  );

  // Gradient button
  if (gradient || gradientColors) {
    const colors = gradientColors || [theme.colors.primaryGradientStart, theme.colors.primaryGradientEnd];
    
    // Remove backgroundColor and shadows for gradient
    const gradientStyle: ViewStyle = {
      height: height || currentSize.height,
      paddingHorizontal: currentSize.paddingHorizontal,
      borderRadius: BorderRadius.button,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      opacity: disabled ? 0.5 : 1,
      overflow: 'hidden', // Important: prevents line artifacts
    };

    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.8}
        style={[
          fullWidth ? { width: '100%' } : undefined,
          { borderRadius: BorderRadius.button, overflow: 'hidden' },
          style,
        ]}
      >
        <LinearGradient
          colors={colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={gradientStyle}
        >
          {renderContent()}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={containerStyle}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  iconLeft: {
    marginRight: Spacing.sm,
  },
  iconRight: {
    marginLeft: Spacing.sm,
  },
});

export default Button;

