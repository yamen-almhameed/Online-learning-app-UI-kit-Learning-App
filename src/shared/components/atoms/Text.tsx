// ============================================
// Text Component - Reusable text component
// ============================================

import React from 'react';
import { Text as RNText, TextStyle, StyleSheet, TextProps as RNTextProps } from 'react-native';
import { useTheme } from '../../../core/hooks/useTheme';
import { Typography, FontWeights } from '../../../core/theme/fonts';

// Types
type TextVariant = 
  | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  | 'bodyLarge' | 'body' | 'bodySmall'
  | 'label' | 'labelSmall'
  | 'caption' | 'captionSmall'
  | 'buttonLarge' | 'button' | 'buttonSmall';

type TextWeight = 'regular' | 'medium' | 'semiBold' | 'bold' | 'extraBold';

interface TextProps extends RNTextProps {
  variant?: TextVariant;
  weight?: TextWeight;
  color?: string;
  align?: 'auto' | 'left' | 'right' | 'center' | 'justify';
  children: React.ReactNode;
  style?: TextStyle | TextStyle[];
}

export const Text: React.FC<TextProps> = ({
  variant = 'body',
  weight,
  color,
  align,
  children,
  style,
  ...props
}) => {
  const { theme } = useTheme();

  // Get typography styles based on variant
  const typographyStyle = Typography[variant] || Typography.body;

  // Build text style
  const textStyle: TextStyle = {
    ...typographyStyle,
    color: color || theme.colors.textPrimary,
    ...(weight && { fontWeight: FontWeights[weight] }),
    ...(align && { textAlign: align }),
  };

  return (
    <RNText style={[textStyle, style]} {...props}>
      {children}
    </RNText>
  );
};

// Preset text components for convenience
export const H1: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="h1" {...props} />
);

export const H2: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="h2" {...props} />
);

export const H3: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="h3" {...props} />
);

export const H4: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="h4" {...props} />
);

export const H5: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="h5" {...props} />
);

export const H6: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="h6" {...props} />
);

export const BodyLarge: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="bodyLarge" {...props} />
);

export const Body: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="body" {...props} />
);

export const BodySmall: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="bodySmall" {...props} />
);

export const Label: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="label" {...props} />
);

export const Caption: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="caption" {...props} />
);

export default Text;

