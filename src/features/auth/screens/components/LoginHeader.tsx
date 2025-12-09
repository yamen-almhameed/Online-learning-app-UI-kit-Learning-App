// ============================================
// Login Header Component
// ============================================

import React from 'react';
import { View } from 'react-native';
import { Text } from '../../../../shared/components/atoms/Text';
import { Spacer } from '../../../../shared/components/atoms/Spacer';
import { styles } from '../styles/LoginStyles';

const LoginHeader: React.FC = () => (
  <View>
    <Spacer size="huge" />
    <Text style={styles.title}>Login</Text>
    <Text style={styles.subtitle}>Enter your details to log in</Text>
  </View>
);

export default LoginHeader;
