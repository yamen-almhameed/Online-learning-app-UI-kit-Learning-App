// ============================================
// SocialButton Component - Social login buttons
// ============================================

import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle, Image, ImageSourcePropType } from 'react-native';
import { useTheme } from '../../../core/hooks/useTheme';
import { Text } from '../atoms/Text';
import { BorderRadius } from '../../../core/theme/radius';
import { Spacing } from '../../../core/theme/spacing';
import { ComponentShadows } from '../../../core/theme/shadows';

// Icons
const GoogleIcon = require('../../assets/icons/Google.png');
const AppleIcon = require('../../assets/icons/Vector.png');

// Types
type SocialProvider = 'google' | 'apple' | 'facebook';

interface SocialButtonProps {
  provider: SocialProvider;
  onPress: () => void;
  style?: ViewStyle;
  loading?: boolean;
}

// Provider config
const providerConfig: Record<SocialProvider, { label: string; icon: ImageSourcePropType; bgColor?: string }> = {
  google: {
    label: 'Sign in with Google',
    icon: GoogleIcon,
  },
  apple: {
    label: 'Sign in with Apple',
    icon: AppleIcon,
  },
  facebook: {
    label: 'Sign in with Facebook',
    icon: GoogleIcon, // Placeholder - replace with Facebook icon
    bgColor: '#1877F2',
  },
};

export const SocialButton: React.FC<SocialButtonProps> = ({
  provider,
  onPress,
  style,
  loading = false,
}) => {
  const { theme } = useTheme();
  const config = providerConfig[provider];

  const isFacebook = provider === 'facebook';
  const backgroundColor = config.bgColor || theme.colors.card;
  const textColor = isFacebook ? theme.colors.textWhite : theme.colors.textPrimary;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      disabled={loading}
      style={[
        styles.container,
        {
          backgroundColor,
          ...(!isFacebook && ComponentShadows.button),
        },
        style,
      ]}
    >
      <Image source={config.icon} style={styles.icon} />
      <Text
        variant="button"
        color={textColor}
        style={styles.label}
      >
        {config.label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.button,
    minHeight: 56,
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  label: {
    marginLeft: Spacing.md,
  },
});

export default SocialButton;

