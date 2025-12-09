// ============================================
// CategoryChip Component - Category filter chip
// ============================================

import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../../core/hooks/useTheme';
import { Text } from '../atoms/Text';
import { BorderRadius } from '../../../core/theme/radius';
import { Spacing } from '../../../core/theme/spacing';
import { Colors } from '../../../core/theme/colors';

// Types
interface CategoryChipProps {
  label: string;
  isSelected?: boolean;
  onPress: () => void;
  style?: ViewStyle;
}

export const CategoryChip: React.FC<CategoryChipProps> = ({
  label,
  isSelected = false,
  onPress,
  style,
}) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[
        styles.container,
        {
          backgroundColor: isSelected ? Colors.buttonPrimary : theme.colors.card,
          borderColor: isSelected ? Colors.buttonPrimary : theme.colors.border,
        },
        style,
      ]}
    >
      <Text
        variant="label"
        color={isSelected ? theme.colors.textWhite : theme.colors.textPrimary}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.chip,
    borderWidth: 1,
    marginRight: Spacing.sm,
  },
});

export default CategoryChip;

