// ============================================
// Icon Component - Wrapper for icons
// ============================================

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../../core/hooks/useTheme';
// You can use react-native-vector-icons or any icon library
// import Icon from 'react-native-vector-icons/Feather';

// Types
type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

interface IconProps {
  name: string;
  size?: IconSize;
  color?: string;
  style?: ViewStyle;
  containerStyle?: ViewStyle;
}

// Size mapping
const sizeMap: Record<IconSize, number> = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
  xxl: 40,
};

export const AppIcon: React.FC<IconProps> = ({
  name,
  size = 'md',
  color,
  style,
  containerStyle,
}) => {
  const { theme } = useTheme();
  const iconSize = sizeMap[size];
  const iconColor = color || theme.colors.textPrimary;

  // Placeholder - Replace with actual icon library
  // return (
  //   <View style={containerStyle}>
  //     <Icon name={name} size={iconSize} color={iconColor} style={style} />
  //   </View>
  // );

  // Temporary text-based icons (replace with actual icon library)
  const iconMap: Record<string, string> = {
    'mail': '✉️',
    'lock': '🔒',
    'eye': '👁️',
    'eye-off': '👁️‍🗨️',
    'user': '👤',
    'search': '🔍',
    'home': '🏠',
    'book': '📚',
    'play': '▶️',
    'heart': '❤️',
    'star': '⭐',
    'settings': '⚙️',
    'bell': '🔔',
    'arrow-left': '←',
    'arrow-right': '→',
    'chevron-left': '‹',
    'chevron-right': '›',
    'check': '✓',
    'x': '✕',
    'plus': '+',
    'minus': '-',
    'filter': '⚡',
    'clock': '🕐',
    'calendar': '📅',
    'bookmark': '🔖',
    'share': '↗️',
    'download': '⬇️',
    'upload': '⬆️',
    'camera': '📷',
    'image': '🖼️',
    'video': '🎬',
    'music': '🎵',
    'mic': '🎤',
    'phone': '📱',
    'message': '💬',
    'send': '📤',
    'trash': '🗑️',
    'edit': '✏️',
    'copy': '📋',
    'link': '🔗',
    'globe': '🌐',
    'location': '📍',
    'map': '🗺️',
    'compass': '🧭',
    'wifi': '📶',
    'bluetooth': '🔵',
    'battery': '🔋',
    'power': '⚡',
    'sun': '☀️',
    'moon': '🌙',
    'cloud': '☁️',
    'rain': '🌧️',
    'snow': '❄️',
    'wind': '💨',
    'fire': '🔥',
    'droplet': '💧',
    'trending-up': '📈',
    'trending-down': '📉',
    'dollar': '💵',
    'credit-card': '💳',
    'shopping-cart': '🛒',
    'shopping-bag': '🛍️',
    'gift': '🎁',
    'award': '🏆',
    'graduation': '🎓',
  };

  return (
    <View style={[{ width: iconSize, height: iconSize, justifyContent: 'center', alignItems: 'center' }, containerStyle]}>
      <View style={[{ fontSize: iconSize * 0.8 }, style as any]}>
        {/* Replace with actual icon component */}
        {/* <Text style={{ fontSize: iconSize * 0.8 }}>{iconMap[name] || '●'}</Text> */}
      </View>
    </View>
  );
};

export default AppIcon;

