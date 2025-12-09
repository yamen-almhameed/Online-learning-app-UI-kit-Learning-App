// ============================================
// Theme Index - Export all theme modules
// ============================================

import { Colors, DarkColors, ColorType } from './colors';
import { Fonts, FontFamily, FontSizes, FontWeights, Typography, LineHeights, LetterSpacing } from './fonts';
import { Spacing, Padding, Margin, Gap } from './spacing';
import { Radius, BorderRadius } from './radius';
import { Shadows, ComponentShadows, createShadow } from './shadows';

// Light Theme
export const LightTheme = {
  colors: Colors,
  fonts: Fonts,
  spacing: Spacing,
  padding: Padding,
  margin: Margin,
  gap: Gap,
  radius: Radius,
  borderRadius: BorderRadius,
  shadows: Shadows,
  componentShadows: ComponentShadows,
  isDark: false,
};

// Dark Theme
export const DarkTheme = {
  colors: DarkColors,
  fonts: Fonts,
  spacing: Spacing,
  padding: Padding,
  margin: Margin,
  gap: Gap,
  radius: Radius,
  borderRadius: BorderRadius,
  shadows: Shadows,
  componentShadows: ComponentShadows,
  isDark: true,
};

export type ThemeType = typeof LightTheme;

// Export all modules
export {
  Colors,
  DarkColors,
  Fonts,
  FontFamily,
  FontSizes,
  FontWeights,
  Typography,
  LineHeights,
  LetterSpacing,
  Spacing,
  Padding,
  Margin,
  Gap,
  Radius,
  BorderRadius,
  Shadows,
  ComponentShadows,
  createShadow,
};

// Default export
const Theme = {
  light: LightTheme,
  dark: DarkTheme,
};

export default Theme;

