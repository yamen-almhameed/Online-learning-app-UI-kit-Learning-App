// ============================================
// Login Button Component
// ============================================

import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Button } from '../../../../shared/components/atoms/Button';
import { CustomSwitch } from '../../../../shared/components/atoms/CustomSwitch';
import { Text } from '../../../../shared/components/atoms/Text';
import { Colors } from '../../../../core/theme/colors';
import { styles } from '../styles/LoginStyles';

interface LoginButtonProps {
  onLogin: () => void;
  isLoading: boolean;
  rememberMe: boolean;
  onRememberMeChange: (value: boolean) => void;
  onForgotPassword: () => void;
}

const LoginButton: React.FC<LoginButtonProps> = ({
  onLogin,
  isLoading,
  rememberMe,
  onRememberMeChange,
  onForgotPassword,
}) => (
  <View>
    {/* Login Button */}
    {/* عندما يضغط المستخدم على هذا الزر:
        1. onLogin يتم استدعاؤه (من LoginScreen.handleLogin)
        2. handleLogin يستدعي controller.handleLogin()
        3. controller.handleLogin() يستدعي API
        4. isLoading = true → يظهر loading spinner
        5. بعد انتهاء API → isLoading = false */}
    <Button
      title="Login"
      height={52}
      onPress={onLogin}  // استدعاء handleLogin من LoginScreen
      fullWidth
      gradientColors={['#087E8B', '#0B3954']}
      style={styles.loginButton}
      size="large"
      loading={isLoading}  // يظهر loading أثناء استدعاء API
    />

    {/* Options Row */}
    <View style={styles.optionsRow}>
      <View style={styles.rememberRow}>
        <CustomSwitch
          value={rememberMe}
          onValueChange={onRememberMeChange}
          activeColor={Colors.primary}
          style={styles.switch}
        />
        <Text style={styles.optionText}>Remember Me</Text>
      </View>

      <TouchableOpacity onPress={onForgotPassword}>
        <Text style={styles.optionText}>Forgot Password?</Text>
      </TouchableOpacity>
    </View>
  </View>
);

export default LoginButton;
