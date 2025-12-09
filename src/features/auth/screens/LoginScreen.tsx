import React from 'react';
import { KeyboardAvoidingView, ScrollView, Platform, StatusBar } from 'react-native';
import { useTheme } from '../../../core/hooks/useTheme';
import { LoginScreenProps } from '../../../navigation/types';
import { useLoginController } from '../hooks/useLoginController';
import { styles } from './styles/LoginStyles';
import LoginHeader from './components/LoginHeader';
import LoginForm from './components/LoginForm';
import LoginButton from './components/LoginButton';
import LoginSocial from './components/LoginSocial';
import LoginFooter from './components/LoginFooter';

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const controller = useLoginController();

  const goToSignUp = () => navigation.navigate('SignUp');
  const goToForgotPassword = () => navigation.navigate('SignUp');

  const handleLogin = async () => {
    try {
      await controller.handleLogin();
    } catch (error) {
      // Error is handled in controller
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.keyboardView, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
      
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <LoginHeader />
        
        <LoginForm controller={controller} />
        
        <LoginButton
          onLogin={handleLogin}
          isLoading={controller.isLoading}
          rememberMe={controller.rememberMe}
          onRememberMeChange={controller.setRememberMe}
          onForgotPassword={goToForgotPassword}
        />
        
        <LoginSocial onSocialLogin={controller.handleSocialLogin} />
        
        <LoginFooter onSignUp={goToSignUp} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
