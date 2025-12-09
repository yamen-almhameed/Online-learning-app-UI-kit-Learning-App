// ============================================
// SignUp Screen Styles
// ============================================

import { StyleSheet } from 'react-native';
import { Colors } from '../../../../core/theme/colors';
import { Spacing } from '../../../../core/theme/spacing';

export const styles = StyleSheet.create({
  // Layout
  keyboardView: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
    justifyContent: 'space-between',
  },

  // Header
  title: {
    fontSize: 38,
    fontFamily: 'ClashDisplay-Bold',
    color: Colors.accent,
    letterSpacing: 2,
    textAlign: 'center',
    lineHeight: 40,
    marginTop: Spacing.xxl,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'Montserrat-Medium',
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginTop: Spacing.sm,
  },

  // Form
  inputIcon: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
    tintColor: Colors.textSecondary,
  },

  // Button
  signUpButton: {
    marginTop: Spacing.md,
  },

  // Divider
  dividerText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 20,
    textAlign: 'center',
    color: Colors.textSecondary,
    marginVertical: Spacing.xxl,
  },

  // Footer
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  footerText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 18,
    color: Colors.textSecondary,
  },
  footerLink: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
    color: Colors.primary,
  },
});

export default styles;
