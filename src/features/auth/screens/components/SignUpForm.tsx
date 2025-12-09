// ============================================
// SignUp Form Component
// ============================================

import React from 'react';
import { View, Image } from 'react-native';
import { Input } from '../../../../shared/components/atoms/Input';
import { Spacer } from '../../../../shared/components/atoms/Spacer';
import { styles } from '../styles/SignUpStyles';
import { useSignUpController } from '../../hooks/useSignUpController';

// Icons
const MessageIcon = require('../../../../shared/assets/icons/Message.png');
const LockIcon = require('../../../../shared/assets/icons/Lock.png');

interface SignUpFormProps {
  controller: ReturnType<typeof useSignUpController>;
}

const SignUpForm: React.FC<SignUpFormProps> = ({ controller }) => (
  <View>
    <Spacer size="xxl" />

    {/* Email Input */}
    <Input
      placeholder="abc@email.com"
      value={controller.email}
      onChangeText={controller.setEmail}
      keyboardType="email-address"
      autoCapitalize="none"
      autoCorrect={false}
      error={controller.errors.email}
      leftIcon={<Image source={MessageIcon} style={styles.inputIcon} />}
    />

    {/* Password Input */}
    <Input
      placeholder="Enter your password"
      value={controller.password}
      onChangeText={controller.setPassword}
      secureTextEntry
      showPasswordToggle
      error={controller.errors.password}
      leftIcon={<Image source={LockIcon} style={styles.inputIcon} />}
    />

    {/* Confirm Password Input */}
    <Input
      placeholder="Confirm password"
      value={controller.confirmPassword}
      onChangeText={controller.setConfirmPassword}
      secureTextEntry
      showPasswordToggle
      error={controller.errors.confirmPassword}
      leftIcon={<Image source={LockIcon} style={styles.inputIcon} />}
    />
  </View>
);

export default SignUpForm;
