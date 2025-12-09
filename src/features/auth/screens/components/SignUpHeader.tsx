// ============================================
// SignUp Header Component
// ============================================

import React from 'react';
import { View } from 'react-native';
import { Text } from '../../../../shared/components/atoms/Text';
import { Spacer } from '../../../../shared/components/atoms/Spacer';
import { styles } from '../styles/SignUpStyles';

const SignUpHeader: React.FC = () => (
  <View>
    <Spacer size="huge" />
    <Text style={styles.title}>Sign up</Text>
    <Text style={styles.subtitle}>Enter your details to Sign up</Text>
  </View>
);

export default SignUpHeader;
