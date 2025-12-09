// ============================================
// SearchBar Component - Search input with filters
// ============================================

import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useTheme } from '../../../core/hooks/useTheme';
import { Text } from '../atoms/Text';
import { BorderRadius } from '../../../core/theme/radius';
import { Spacing } from '../../../core/theme/spacing';
import { FontSizes } from '../../../core/theme/fonts';
import { ComponentShadows } from '../../../core/theme/shadows';

// Icons
const SearchIcon = require('../../assets/icons/search-normal.png');
const SettingIcon = require('../../assets/icons/setting-4.png');

// Types
interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onFilterPress?: () => void;
  showFilter?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  onPress?: () => void;
  containerStyle?: ViewStyle;
  autoFocus?: boolean;
  editable?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = 'Search Course',
  onFilterPress,
  showFilter = true,
  onFocus,
  onBlur,
  onPress,
  containerStyle,
  autoFocus = false,
  editable = true,
}) => {
  const { theme } = useTheme();

  const inputContainer = (
    <View
      style={[
        styles.inputContainer,
        {
          backgroundColor: theme.colors.card,
          ...ComponentShadows.card,
        },
      ]}
    >
        {/* Search Icon */}
        <Image 
          source={SearchIcon} 
          style={styles.searchIcon}
          resizeMode="contain"
        />

        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.textLight}
          style={[
            styles.input,
            {
              color: theme.colors.textPrimary,
            },
          ]}
          onFocus={onFocus}
          onBlur={onBlur}
          autoFocus={autoFocus}
          returnKeyType="search"
          editable={editable}
          pointerEvents={editable ? 'auto' : 'none'}
        />

        {/* Settings Icon inside search bar */}
        <TouchableOpacity
          onPress={onFilterPress}
          style={styles.settingsIconContainer}
        >
          <Image 
            source={SettingIcon} 
            style={styles.settingsIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
  );

  return (
    <View style={[styles.container, containerStyle]}>
      {onPress && !editable ? (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onPress}
          style={{ flex: 1 }}
          delayPressIn={0}
          delayPressOut={0}
        >
          {inputContainer}
        </TouchableOpacity>
      ) : (
        inputContainer
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    height: 52,
    borderRadius: BorderRadius.input,
  },
  searchIcon: {
    width: 18,
    height: 18,
    marginRight: Spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: FontSizes.base,
    paddingVertical: Spacing.md,
  },
  filterButton: {
    width: 52,
    height: 52,
    borderRadius: BorderRadius.input,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterIcon: {
    width: 20,
    height: 20,
  },
  settingsIconContainer: {
    padding: Spacing.xs,
  },
  settingsIcon: {
    width: 18,
    height: 18,
  },
});

export default SearchBar;

