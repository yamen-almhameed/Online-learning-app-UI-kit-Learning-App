// ============================================
// Colors - Based on Salford Learning App Design
// ============================================

export const Colors = {
  black: '#1C1C1C',
  // Primary Colors (Teal)
  primary: '#008B8B',
  primaryLight: '#00A5A5',
  primaryDark: '#006B6B',
  primaryGradientStart: '#008B8B',
  primaryGradientEnd: '#006B6B',

  // Secondary Colors (Orange/Gold)
  secondary: '#FFA500',
  secondaryLight: '#FFB733',
  secondaryDark: '#E69500',

  // Background Colors
  background: '#FAF5F0',
  backgroundLight: '#FFFFFF',
  backgroundDark: '#1A1A1A',
  backgroundCream: '#F5EDE4',

  // Onboarding Background Colors
  onboarding1: '#FFE5D9', // Peach/Coral
  onboarding2: '#D4E8F5', // Light Blue
  onboarding3: '#D4E8F5', // Light Blue
  onboardingMint: '#E0F5F0', // Mint Green

  // Text Colors
  textPrimary: '#1A1A1A',
  Backgroundproj: '#F8F1F1',
  textSecondary: '#6E6E6E',
  textLight: '#999999',
  textWhite: '#FFFFFF',
  textMuted: '#8A8A8A',
  backgroundorange: '#FAAD3B',
  // Accent Colors
  accent: '#087E8B',
  buttonPrimary: '#0B3954',
  buttonSecondary: '#087E8B',
  accentLight: '#E0F5F5',
  accentOrange: '#FFA500',

  // Status Colors
  success: '#4CAF50',
  error: '#F44336',
  warning: '#FF9800',
  info: '#2196F3',

  // Border & Divider
  border: '#E8E2DA',
  borderLight: '#F0EBE4',
  divider: '#EEEEEE',

  // Card & Surface
  card: '#FFFFFF',
  cardLight: '#FAF5F0',
  surface: '#F9F9F9',

  // Input Colors
  inputBackground: '#FFFFFF',
  inputBorder: '#008B8B',
  inputBorderFocus: '#4CAF50', // Green border on focus
  inputBorderInactive: '#E8E2DA',
  inputPlaceholder: '#999999',

  // Social Button Colors
  google: '#FFFFFF',
  apple: '#FFFFFF',
  facebook: '#1877F2',

  // Overlay
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',

  // Badge Colors
  badgeNew: '#FF6B6B',
  badgePopular: '#FFA500',
  badgeTrending: '#FF4757',

  // Progress Colors
  progressBackground: '#E8E2DA',
  progressFill: '#008B8B',

  // Tab Bar
  tabBarBackground: '#FFFFFF',
  tabBarActive: '#008B8B',
  tabBarInactive: '#999999',

  // Transparent
  transparent: 'transparent',
};

// Dark Theme Colors Override
export const DarkColors = {
  ...Colors,
  background: '#1A1A1A',
  backgroundLight: '#2A2A2A',
  backgroundCream: '#252525',
  card: '#2A2A2A',
  cardLight: '#333333',
  surface: '#2A2A2A',
  textPrimary: '#FFFFFF',
  textSecondary: '#CCCCCC',
  textLight: '#999999',
  border: '#3A3A3A',
  borderLight: '#444444',
  divider: '#3A3A3A',
  inputBackground: '#2A2A2A',
  inputBorderInactive: '#3A3A3A',
  tabBarBackground: '#1A1A1A',
};

export type ColorType = typeof Colors;

