// ============================================
// SignUp Button Component
// ============================================

import React from 'react';
import { View } from 'react-native';
import { Button } from '../../../../shared/components/atoms/Button';
import { styles } from '../styles/SignUpStyles';

interface SignUpButtonProps {
  onSignUp: () => void;
  isLoading: boolean;
}

const SignUpButton: React.FC<SignUpButtonProps> = ({ onSignUp, isLoading }) => (
  <View>
    <Button
      title="Sign up"
      height={52}
      onPress={onSignUp}
      fullWidth
      gradientColors={['#087E8B', '#0B3954']}
      style={styles.signUpButton}
      size="large"
      loading={isLoading}
    />
  </View>
);

export default SignUpButton;
