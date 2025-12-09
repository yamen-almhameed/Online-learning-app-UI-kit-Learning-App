// ============================================
// Login Footer Component
// ============================================

import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from '../../../../shared/components/atoms/Text';
import { styles } from '../styles/LoginStyles';

interface LoginFooterProps {
  onSignUp: () => void;
}

const LoginFooter: React.FC<LoginFooterProps> = ({ onSignUp }) => (
  <View style={styles.footerRow}>
    <Text style={styles.footerText}>Don't have an account? </Text>
    <TouchableOpacity onPress={onSignUp}>
      <Text style={styles.footerLink}>Sign Up</Text>
    </TouchableOpacity>
  </View>
);

export default LoginFooter;
