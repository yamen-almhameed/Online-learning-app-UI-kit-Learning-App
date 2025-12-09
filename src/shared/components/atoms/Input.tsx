// ============================================
// Input Component - Reusable text input
// ============================================

import React, { useState, forwardRef } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
  TextInputProps,
  Image,
} from 'react-native';
import { useTheme } from '../../../core/hooks/useTheme';
import { Text } from './Text';
import { Spacing } from '../../../core/theme/spacing';
import { BorderRadius } from '../../../core/theme/radius';
import { FontSizes } from '../../../core/theme/fonts';
import { Colors } from '../../../core/theme/colors';

// Icons
const HiddenIcon = require('../../assets/icons/Hidden.png');

// Types
interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  onRightIconPress?: () => void;
  showPasswordToggle?: boolean;
}

export const Input = forwardRef<TextInput, InputProps>(({
  label,
  error,
  leftIcon,
  rightIcon,
  containerStyle,
  inputStyle,
  onRightIconPress,
  showPasswordToggle = false,
  secureTextEntry,
  ...props
}, ref) => {
  const { theme } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  // Determine border color
  const getBorderColor = () => {
    if (error) return theme.colors.error;
    if (isFocused) return Colors.accent; // Green border on focus
    return theme.colors.inputBorderInactive;
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  // Render eye icon (normal eye when visible, hidden icon when password is hidden)
  const renderEyeIcon = () => {
    if (isPasswordVisible) {
      // Normal eye icon (visible eye - oval shape)
      const iconColor = theme.colors.textLight;
      return (
        <View style={styles.eyeIconContainer}>
          {/* Eye shape - oval */}
          <View style={[styles.eyeShape, { borderColor: iconColor }]}>
            {/* Pupil */}
            <View style={[styles.eyePupil, { backgroundColor: iconColor }]} />
          </View>
        </View>
      );
    } else {
      // Hidden icon (eye with line)
      return (
        <Image 
          source={HiddenIcon} 
          style={[
            styles.eyeIcon,
            { tintColor: theme.colors.textLight }
          ]} 
        />
      );
    }
  };

  // Render right icon
  const renderRightIcon = () => {
    if (showPasswordToggle && secureTextEntry !== undefined) {
      return (
        <TouchableOpacity 
          onPress={togglePasswordVisibility}
          style={styles.iconContainer}
        >
          {renderEyeIcon()}
        </TouchableOpacity>
      );
    }
    
    if (rightIcon) {
      return (
        <TouchableOpacity 
          onPress={onRightIconPress}
          style={styles.iconContainer}
          disabled={!onRightIconPress}
        >
          {rightIcon}
        </TouchableOpacity>
      );
    }
    
    return null;
  };

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label && (
        <Text 
          variant="label" 
          color={theme.colors.textSecondary}
          style={styles.label}
        >
          {label}
        </Text>
      )}
      
      <View
        style={[
          styles.container,
          {
            backgroundColor: theme.colors.inputBackground,
            borderColor: getBorderColor(),
            borderWidth: isFocused ? 1.5 : 1,
          },
        ]}
      >
        {leftIcon && (
          <View style={styles.iconContainer}>
            {leftIcon}
          </View>
        )}
        
        <TextInput
          ref={ref}
          style={[
            styles.input,
            {
              color: theme.colors.textPrimary,
            },
            inputStyle,
          ]}
          placeholderTextColor={theme.colors.inputPlaceholder}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={showPasswordToggle ? !isPasswordVisible : secureTextEntry}
          {...props}
        />
        
        {renderRightIcon()}
      </View>
      
      {error && (
        <Text 
          variant="caption" 
          color={theme.colors.error}
          style={styles.error}
        >
          {error}
        </Text>
      )}
    </View>
  );
});

Input.displayName = 'Input';

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: Spacing.base,
  },
  label: {
    marginBottom: Spacing.sm,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.input,
    paddingHorizontal: Spacing.base,
    minHeight: 56,
  },
  input: {
    flex: 1,
    fontSize: FontSizes.base,
    paddingVertical: Spacing.md,
  },
  iconContainer: {
    paddingHorizontal: Spacing.sm,
  },
  eyeIcon: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
  },
  eyeIconContainer: {
    width: 22,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eyeShape: {
    width: 20,
    height: 14,
    borderRadius: 10,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  eyePupil: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  error: {
    marginTop: Spacing.xs,
    marginLeft: Spacing.xs,
  },
});

export default Input;

