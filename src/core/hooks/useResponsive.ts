// ============================================
// useResponsive Hook - Responsive dimensions hook
// ============================================

import { useState, useEffect } from 'react';
import { Dimensions, ScaledSize } from 'react-native';
import { 
  Responsive, 
  wp, 
  hp, 
  normalize, 
  scaleWidth, 
  scaleHeight, 
  moderateScale,
  fontScale,
  isSmallDevice,
  isMediumDevice,
  isLargeDevice,
  isTablet,
} from '../utils/responsive';

interface ResponsiveState {
  width: number;
  height: number;
  isSmallDevice: boolean;
  isMediumDevice: boolean;
  isLargeDevice: boolean;
  isTablet: boolean;
}

interface UseResponsiveReturn extends ResponsiveState {
  wp: (percentage: number) => number;
  hp: (percentage: number) => number;
  normalize: (size: number) => number;
  scaleWidth: (size: number) => number;
  scaleHeight: (size: number) => number;
  moderateScale: (size: number, factor?: number) => number;
  fontScale: (size: number) => number;
}

export const useResponsive = (): UseResponsiveReturn => {
  const [dimensions, setDimensions] = useState<ResponsiveState>({
    width: Responsive.width,
    height: Responsive.height,
    isSmallDevice: isSmallDevice(),
    isMediumDevice: isMediumDevice(),
    isLargeDevice: isLargeDevice(),
    isTablet: isTablet(),
  });

  useEffect(() => {
    const handleDimensionChange = ({ window }: { window: ScaledSize }) => {
      setDimensions({
        width: window.width,
        height: window.height,
        isSmallDevice: window.width < 375,
        isMediumDevice: window.width >= 375 && window.width < 414,
        isLargeDevice: window.width >= 414,
        isTablet: window.width >= 768,
      });
    };

    const subscription = Dimensions.addEventListener('change', handleDimensionChange);

    return () => {
      subscription?.remove();
    };
  }, []);

  return {
    ...dimensions,
    wp,
    hp,
    normalize,
    scaleWidth,
    scaleHeight,
    moderateScale,
    fontScale,
  };
};

export default useResponsive;

