// ============================================
// SignUp Footer Component
// ============================================

import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from '../../../../shared/components/atoms/Text';
import { styles } from '../styles/SignUpStyles';

interface SignUpFooterProps {
  onLogin: () => void;
}

const SignUpFooter: React.FC<SignUpFooterProps> = ({ onLogin }) => (
  <View style={styles.footerRow}>
    <Text style={styles.footerText}>Joined us before? </Text>
    <TouchableOpacity onPress={onLogin}>
      <Text style={styles.footerLink}>Login</Text>
    </TouchableOpacity>
  </View>
);

export default SignUpFooter;
