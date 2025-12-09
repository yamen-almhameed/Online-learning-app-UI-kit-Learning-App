// ============================================
// Login Social Component
// ============================================

import React from 'react';
import { View } from 'react-native';
import { Text } from '../../../../shared/components/atoms/Text';
import { Spacer } from '../../../../shared/components/atoms/Spacer';
import { SocialButton } from '../../../../shared/components/molecules/SocialButton';
import { styles } from '../styles/LoginStyles';

interface LoginSocialProps {
  onSocialLogin: (provider: 'google' | 'apple') => void;
}

const LoginSocial: React.FC<LoginSocialProps> = ({ onSocialLogin }) => (
  <View>
    <Text style={styles.dividerText}>Or</Text>
    
    <SocialButton provider="google" onPress={() => onSocialLogin('google')} />
    <Spacer size="md" />
    <SocialButton provider="apple" onPress={() => onSocialLogin('apple')} />
  </View>
);

export default LoginSocial;
