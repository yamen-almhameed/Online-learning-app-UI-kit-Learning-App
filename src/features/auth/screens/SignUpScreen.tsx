import React, { useEffect } from 'react';
import { View, KeyboardAvoidingView, ScrollView, Platform, StatusBar } from 'react-native';
import { useTheme } from '../../../core/hooks/useTheme';
import { useAuth } from '../../../core/hooks/useAuth';
import { SignUpScreenProps } from '../../../navigation/types';
import { useSignUpController } from '../hooks/useSignUpController';
import { styles } from './styles/SignUpStyles';
import SignUpHeader from './components/SignUpHeader';
import SignUpForm from './components/SignUpForm';
import SignUpButton from './components/SignUpButton';
import SignUpFooter from './components/SignUpFooter';

const SignUpScreen: React.FC<SignUpScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const { isAuthenticated } = useAuth();
  const controller = useSignUpController();

  const goToLogin = () => navigation.navigate('Login');

  useEffect(() => {
    if (isAuthenticated) {
      // Navigation handled by AppRoutes
    }
  }, [isAuthenticated]);

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
        {/* Main Content */}
        <View>
          <SignUpHeader />
          <SignUpForm controller={controller} />
          <SignUpButton
            onSignUp={controller.handleSignUp}
            isLoading={controller.isLoading}
          />
        </View>

        {/* Footer - Always at bottom */}
        <SignUpFooter onLogin={goToLogin} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignUpScreen;
