// ============================================
// Spacing - Consistent spacing system
// ============================================

export const Spacing = {
  // Base unit: 4px
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
  huge: 48,
  giant: 56,
  massive: 64,
};

// Common padding values
export const Padding = {
  screen: {
    horizontal: Spacing.lg,
    vertical: Spacing.xl,
  },
  card: {
    horizontal: Spacing.base,
    vertical: Spacing.base,
  },
  button: {
    horizontal: Spacing.xl,
    vertical: Spacing.md,
  },
  input: {
    horizontal: Spacing.base,
    vertical: Spacing.md,
  },
};

// Common margin values
export const Margin = {
  section: Spacing.xl,
  item: Spacing.md,
  element: Spacing.sm,
};

// Gap values for Flexbox
export const Gap = {
  xs: Spacing.xs,
  sm: Spacing.sm,
  md: Spacing.md,
  lg: Spacing.base,
  xl: Spacing.xl,
};

