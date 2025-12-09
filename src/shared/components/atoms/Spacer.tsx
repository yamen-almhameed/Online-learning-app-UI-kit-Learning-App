// ============================================
// Spacer Component - Flexible spacing component
// ============================================

import React from 'react';
import { View, ViewStyle } from 'react-native';
import { Spacing } from '../../../core/theme/spacing';

// Types
type SpacerSize = 'xs' | 'sm' | 'md' | 'base' | 'lg' | 'xl' | 'xxl' | 'xxxl' | 'huge';

interface SpacerProps {
  size?: SpacerSize;
  horizontal?: boolean;
  flex?: number;
  style?: ViewStyle;
}

export const Spacer: React.FC<SpacerProps> = ({
  size = 'base',
  horizontal = false,
  flex,
  style,
}) => {
  const spacingValue = Spacing[size];

  const spacerStyle: ViewStyle = {
    ...(flex !== undefined ? { flex } : {}),
    ...(horizontal ? { width: spacingValue } : { height: spacingValue }),
    ...style,
  };

  return <View style={spacerStyle} />;
};

// Preset spacers for convenience
export const SpacerXS: React.FC<{ horizontal?: boolean }> = ({ horizontal }) => (
  <Spacer size="xs" horizontal={horizontal} />
);

export const SpacerSM: React.FC<{ horizontal?: boolean }> = ({ horizontal }) => (
  <Spacer size="sm" horizontal={horizontal} />
);

export const SpacerMD: React.FC<{ horizontal?: boolean }> = ({ horizontal }) => (
  <Spacer size="md" horizontal={horizontal} />
);

export const SpacerBase: React.FC<{ horizontal?: boolean }> = ({ horizontal }) => (
  <Spacer size="base" horizontal={horizontal} />
);

export const SpacerLG: React.FC<{ horizontal?: boolean }> = ({ horizontal }) => (
  <Spacer size="lg" horizontal={horizontal} />
);

export const SpacerXL: React.FC<{ horizontal?: boolean }> = ({ horizontal }) => (
  <Spacer size="xl" horizontal={horizontal} />
);

export const SpacerXXL: React.FC<{ horizontal?: boolean }> = ({ horizontal }) => (
  <Spacer size="xxl" horizontal={horizontal} />
);

// Flexible spacer that fills available space
export const FlexSpacer: React.FC = () => <Spacer flex={1} />;

export default Spacer;

