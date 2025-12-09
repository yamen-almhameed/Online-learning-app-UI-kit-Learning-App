// ============================================
// i18n Configuration - Internationalization setup
// ============================================

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { I18nManager } from 'react-native';
import { STORAGE_KEYS, APP_SETTINGS } from '../constants/AppConstants';

// Import translations
import en from './translations/en.json';
import ar from './translations/ar.json';

// Language resources
const resources = {
  en: { translation: en },
  ar: { translation: ar },
};

// Language detector plugin
const languageDetector = {
  type: 'languageDetector' as const,
  async: true,
  detect: async (callback: (lng: string) => void) => {
    try {
      const savedLanguage = await AsyncStorage.getItem(STORAGE_KEYS.LANGUAGE);
      if (savedLanguage) {
        callback(savedLanguage);
        return;
      }
    } catch (error) {
      console.log('Error detecting language:', error);
    }
    callback(APP_SETTINGS.DEFAULT_LANGUAGE);
  },
  init: () => {},
  cacheUserLanguage: async (lng: string) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.LANGUAGE, lng);
    } catch (error) {
      console.log('Error caching language:', error);
    }
  },
};

// Initialize i18n
i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    resources,
    fallbackLng: APP_SETTINGS.DEFAULT_LANGUAGE,
    supportedLngs: APP_SETTINGS.SUPPORTED_LANGUAGES,
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

/**
 * Change application language
 * @param language - Language code ('en' or 'ar')
 */
export const changeLanguage = async (language: string): Promise<void> => {
  try {
    await i18n.changeLanguage(language);
    await AsyncStorage.setItem(STORAGE_KEYS.LANGUAGE, language);
    
    // Handle RTL for Arabic
    const isRTL = language === 'ar';
    if (I18nManager.isRTL !== isRTL) {
      I18nManager.allowRTL(isRTL);
      I18nManager.forceRTL(isRTL);
      // Note: App restart required for RTL changes to take effect
    }
  } catch (error) {
    console.log('Error changing language:', error);
  }
};

/**
 * Get current language
 */
export const getCurrentLanguage = (): string => {
  return i18n.language || APP_SETTINGS.DEFAULT_LANGUAGE;
};

/**
 * Check if current language is RTL
 */
export const isRTL = (): boolean => {
  return i18n.language === 'ar' || I18nManager.isRTL;
};

export default i18n;

