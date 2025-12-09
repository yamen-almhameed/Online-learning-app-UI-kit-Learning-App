// ============================================
// Fonts - Typography System
// ============================================

export const FontFamily = {
  regular: 'System',
  medium: 'System',
  semiBold: 'System',
  bold: 'System',
  extraBold: 'System',
};

export const FontSizes = {
  xs: 10,
  sm: 12,
  md: 14,
  base: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 28,
  huge: 32,
  giant: 36,
  massive: 40,
  display: 48,
};

export const FontWeights = {
  regular: '400' as const,
  medium: '500' as const,
  semiBold: '600' as const,
  bold: '700' as const,
  extraBold: '800' as const,
};

// Typography Presets - مع lineHeight صحيح (pixels)
export const Typography = {
  // Headings
  h1: {
    fontFamily: FontFamily.bold,
    fontSize: FontSizes.display,
    fontWeight: FontWeights.bold,
    lineHeight: 56, // fontSize * 1.2
  },
  h2: {
    fontFamily: FontFamily.bold,
    fontSize: FontSizes.giant,
    fontWeight: FontWeights.bold,
    lineHeight: 44,
  },
  h3: {
    fontFamily: FontFamily.bold,
    fontSize: FontSizes.huge,
    fontWeight: FontWeights.bold,
    lineHeight: 40,
  },
  h4: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.semiBold,
    lineHeight: 32,
  },
  h5: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.semiBold,
    lineHeight: 28,
  },
  h6: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semiBold,
    lineHeight: 24,
  },

  // Body Text
  bodyLarge: {
    fontFamily: FontFamily.regular,
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.regular,
    lineHeight: 28,
  },
  body: {
    fontFamily: FontFamily.regular,
    fontSize: FontSizes.base,
    fontWeight: FontWeights.regular,
    lineHeight: 24,
  },
  bodySmall: {
    fontFamily: FontFamily.regular,
    fontSize: FontSizes.md,
    fontWeight: FontWeights.regular,
    lineHeight: 20,
  },

  // Labels
  label: {
    fontFamily: FontFamily.medium,
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
    lineHeight: 20,
  },
  labelSmall: {
    fontFamily: FontFamily.medium,
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    lineHeight: 16,
  },

  // Captions
  caption: {
    fontFamily: FontFamily.regular,
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.regular,
    lineHeight: 16,
  },
  captionSmall: {
    fontFamily: FontFamily.regular,
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.regular,
    lineHeight: 14,
  },

  // Button Text
  buttonLarge: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semiBold,
    lineHeight: 24,
  },
  button: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSizes.base,
    fontWeight: FontWeights.semiBold,
    lineHeight: 22,
  },
  buttonSmall: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semiBold,
    lineHeight: 18,
  },
};

export const Fonts = {
  family: FontFamily,
  sizes: FontSizes,
  weights: FontWeights,
  typography: Typography,
};
