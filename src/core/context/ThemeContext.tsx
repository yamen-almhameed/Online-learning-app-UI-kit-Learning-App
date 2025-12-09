// ============================================
// Theme Context - Theme state management
// ============================================

import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';
import { LightTheme, DarkTheme, ThemeType } from '../theme';
import { STORAGE_KEYS } from '../constants/AppConstants';

// Types
type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeContextType {
  theme: ThemeType;
  isDark: boolean;
  themeMode: ThemeMode;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
}

// Create context
export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Props
interface ThemeProviderProps {
  children: ReactNode;
}

// Provider component
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('light');
  const [isLoading, setIsLoading] = useState(true);

  // Determine if dark mode based on theme mode
  const isDark = themeMode === 'system' 
    ? systemColorScheme === 'dark' 
    : themeMode === 'dark';

  // Get current theme
  const theme = isDark ? DarkTheme : LightTheme;

  // Load saved theme on mount
  useEffect(() => {
    loadTheme();
  }, []);

  // Load theme from storage
  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(STORAGE_KEYS.THEME);
      if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
        setThemeModeState(savedTheme as ThemeMode);
      }
    } catch (error) {
      console.log('Error loading theme:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Save theme to storage
  const saveTheme = async (mode: ThemeMode) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.THEME, mode);
    } catch (error) {
      console.log('Error saving theme:', error);
    }
  };

  // Toggle between light and dark
  const toggleTheme = useCallback(() => {
    const newMode = isDark ? 'light' : 'dark';
    setThemeModeState(newMode);
    saveTheme(newMode);
  }, [isDark]);

  // Set specific theme mode
  const setThemeMode = useCallback((mode: ThemeMode) => {
    setThemeModeState(mode);
    saveTheme(mode);
  }, []);

  // Context value
  const value: ThemeContextType = {
    theme,
    isDark,
    themeMode,
    toggleTheme,
    setThemeMode,
  };

  // Don't render until theme is loaded
  if (isLoading) {
    return null;
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;

