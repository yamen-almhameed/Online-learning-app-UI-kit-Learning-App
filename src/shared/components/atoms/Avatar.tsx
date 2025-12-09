// ============================================
// Avatar Component - User avatar/image
// ============================================

import React from 'react';
import { View, Image, StyleSheet, ViewStyle, ImageStyle } from 'react-native';
import { useTheme } from '../../../core/hooks/useTheme';
import { Text } from './Text';
import { BorderRadius } from '../../../core/theme/radius';

// Types
type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

interface AvatarProps {
  source?: { uri: string } | number;
  name?: string;
  size?: AvatarSize;
  style?: ViewStyle;
  imageStyle?: ImageStyle;
  showBadge?: boolean;
  badgeColor?: string;
}

// Size mapping
const sizeMap: Record<AvatarSize, number> = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 48,
  xl: 64,
  xxl: 80,
};

const fontSizeMap: Record<AvatarSize, number> = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 18,
  xl: 24,
  xxl: 32,
};

export const Avatar: React.FC<AvatarProps> = ({
  source,
  name,
  size = 'md',
  style,
  imageStyle,
  showBadge = false,
  badgeColor,
}) => {
  const { theme } = useTheme();
  const dimension = sizeMap[size];
  const fontSize = fontSizeMap[size];
  const badgeSize = dimension * 0.3;

  // Get initials from name
  const getInitials = (fullName: string): string => {
    const names = fullName.trim().split(' ');
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    }
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  const containerStyle: ViewStyle = {
    width: dimension,
    height: dimension,
    borderRadius: BorderRadius.avatar,
    backgroundColor: theme.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  };

  // Render badge
  const renderBadge = () => {
    if (!showBadge) return null;

    return (
      <View
        style={[
          styles.badge,
          {
            width: badgeSize,
            height: badgeSize,
            borderRadius: badgeSize / 2,
            backgroundColor: badgeColor || theme.colors.success,
            borderColor: theme.colors.backgroundLight,
          },
        ]}
      />
    );
  };

  // Render with image
  if (source) {
    return (
      <View style={[containerStyle, style]}>
        <Image
          source={source}
          style={[
            {
              width: dimension,
              height: dimension,
              borderRadius: BorderRadius.avatar,
            },
            imageStyle,
          ]}
          resizeMode="cover"
        />
        {renderBadge()}
      </View>
    );
  }

  // Render with initials
  if (name) {
    return (
      <View style={[containerStyle, style]}>
        <Text
          style={{
            fontSize,
            fontWeight: '600',
            color: theme.colors.textWhite,
          }}
        >
          {getInitials(name)}
        </Text>
        {renderBadge()}
      </View>
    );
  }

  // Render placeholder
  return (
    <View style={[containerStyle, style]}>
      <Text
        style={{
          fontSize,
          color: theme.colors.textWhite,
        }}
      >
        👤
      </Text>
      {renderBadge()}
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderWidth: 2,
  },
});

export default Avatar;

