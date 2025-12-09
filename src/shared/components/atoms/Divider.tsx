// ============================================
// Divider Component - Horizontal/Vertical divider
// ============================================

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../../core/hooks/useTheme';
import { Text } from './Text';
import { Spacing } from '../../../core/theme/spacing';

// Types
interface DividerProps {
  vertical?: boolean;
  thickness?: number;
  color?: string;
  textColor?: string;
  spacing?: number;
  text?: string;
  style?: ViewStyle;
}

export const Divider: React.FC<DividerProps> = ({
  vertical = false,
  thickness = 1,
  color,
  textColor,
  spacing = Spacing.base,
  text,
  style,
}) => {
  const { theme } = useTheme();
  const dividerColor = color || theme.colors.divider;

  // Text divider (with text in middle)
  if (text) {
    return (
      <View style={[styles.textContainer, { marginVertical: spacing }, style]}>
        <View
          style={[
            styles.line,
            {
              backgroundColor: dividerColor,
              height: thickness,
            },
          ]}
        />
        <Text 
          variant="bodySmall" 
          color={textColor || theme.colors.textLight}
          style={styles.text}
        >
          {text}
        </Text>
        <View
          style={[
            styles.line,
            {
              backgroundColor: dividerColor,
              height: thickness,
            },
          ]}
        />
      </View>
    );
  }

  // Simple divider
  if (vertical) {
    return (
      <View
        style={[
          {
            width: thickness,
            backgroundColor: dividerColor,
            marginHorizontal: spacing,
          },
          style,
        ]}
      />
    );
  }

  return (
    <View
      style={[
        {
          height: thickness,
          backgroundColor: dividerColor,
          marginVertical: spacing,
        },
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  line: {
    flex: 1,
  },
  text: {
    marginHorizontal: Spacing.base,
  },
});

export default Divider;

