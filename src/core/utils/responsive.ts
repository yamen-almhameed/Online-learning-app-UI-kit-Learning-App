// ============================================
// Responsive Utilities - Screen size helpers
// ============================================

import { Dimensions, PixelRatio, Platform, ScaledSize } from 'react-native';

// Get initial dimensions
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Base dimensions (based on iPhone 11 Pro design)
const BASE_WIDTH = 375;
const BASE_HEIGHT = 812;

// Scale factors
const widthScale = SCREEN_WIDTH / BASE_WIDTH;
const heightScale = SCREEN_HEIGHT / BASE_HEIGHT;

/**
 * Width Percentage - Convert percentage to pixels based on screen width
 * @param percentage - Percentage value (0-100)
 * @returns Pixel value
 */
export const wp = (percentage: number): number => {
  const value = (percentage * SCREEN_WIDTH) / 100;
  return Math.round(value);
};

/**
 * Height Percentage - Convert percentage to pixels based on screen height
 * @param percentage - Percentage value (0-100)
 * @returns Pixel value
 */
export const hp = (percentage: number): number => {
  const value = (percentage * SCREEN_HEIGHT) / 100;
  return Math.round(value);
};

/**
 * Normalize - Scale a value based on screen width
 * @param size - Size value to normalize
 * @returns Normalized size value
 */
export const normalize = (size: number): number => {
  const newSize = size * widthScale;
  
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  }
  return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
};

/**
 * Scale Width - Scale a width value
 * @param size - Width value to scale
 * @returns Scaled width value
 */
export const scaleWidth = (size: number): number => {
  return Math.round(size * widthScale);
};

/**
 * Scale Height - Scale a height value
 * @param size - Height value to scale
 * @returns Scaled height value
 */
export const scaleHeight = (size: number): number => {
  return Math.round(size * heightScale);
};

/**
 * Moderate Scale - Scale a value moderately (less aggressive)
 * @param size - Size value to scale
 * @param factor - Scale factor (default 0.5)
 * @returns Moderately scaled value
 */
export const moderateScale = (size: number, factor: number = 0.5): number => {
  return size + (scaleWidth(size) - size) * factor;
};

/**
 * Font Scale - Scale font size
 * @param size - Font size to scale
 * @returns Scaled font size
 */
export const fontScale = (size: number): number => {
  const fontScaleFactor = PixelRatio.getFontScale();
  return Math.round(normalize(size) / fontScaleFactor);
};

// Device size checks
export const isSmallDevice = (): boolean => SCREEN_WIDTH < 375;
export const isMediumDevice = (): boolean => SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 414;
export const isLargeDevice = (): boolean => SCREEN_WIDTH >= 414;
export const isTablet = (): boolean => SCREEN_WIDTH >= 768;

// Screen dimensions
export const screenWidth = SCREEN_WIDTH;
export const screenHeight = SCREEN_HEIGHT;

// Safe area helpers
export const isIphoneX = (): boolean => {
  return (
    Platform.OS === 'ios' &&
    !Platform.isPad &&
    (SCREEN_HEIGHT >= 812 || SCREEN_WIDTH >= 812)
  );
};

export const getStatusBarHeight = (): number => {
  if (Platform.OS === 'ios') {
    return isIphoneX() ? 44 : 20;
  }
  return 0;
};

export const getBottomSpace = (): number => {
  return isIphoneX() ? 34 : 0;
};

// Responsive object export
export const Responsive = {
  // Dimensions
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
  
  // Scale functions
  wp,
  hp,
  normalize,
  scaleWidth,
  scaleHeight,
  moderateScale,
  fontScale,
  
  // Device checks
  isSmallDevice: isSmallDevice(),
  isMediumDevice: isMediumDevice(),
  isLargeDevice: isLargeDevice(),
  isTablet: isTablet(),
  isIphoneX: isIphoneX(),
  
  // Safe area
  statusBarHeight: getStatusBarHeight(),
  bottomSpace: getBottomSpace(),
  
  // Platform
  isIOS: Platform.OS === 'ios',
  isAndroid: Platform.OS === 'android',
};

// Type for dimension change listener
export interface DimensionChangeData {
  window: ScaledSize;
  screen: ScaledSize;
}

export default Responsive;

