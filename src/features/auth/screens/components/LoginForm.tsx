// ============================================
// Login Form Component
// ============================================

import React from 'react';
import { View, Image } from 'react-native';
import { Input } from '../../../../shared/components/atoms/Input';
import { Spacer } from '../../../../shared/components/atoms/Spacer';
import { styles } from '../styles/LoginStyles';
import { useLoginController } from '../../hooks/useLoginController';

// Icons
const MessageIcon = require('../../../../shared/assets/icons/Message.png');
const LockIcon = require('../../../../shared/assets/icons/Lock.png');

interface LoginFormProps {
  controller: ReturnType<typeof useLoginController>;
}

// ============================================
// Login Form - نموذج تسجيل الدخول
// ============================================
// هذا المكون يعرض حقول Email و Password
// controller يحتوي على:
// - email, password: القيم الحالية
// - setEmail, setPassword: تحديث القيم
// - errors: رسائل الأخطاء من API
const LoginForm: React.FC<LoginFormProps> = ({ controller }) => (
  <View>
    <Spacer size="xxl" />
    
    {/* Email Input */}
    {/* عندما يكتب المستخدم، controller.setEmail يتم استدعاؤه */}
    <Input
      placeholder="abc@email.com"
      value={controller.email}  // القيمة الحالية من controller
      onChangeText={controller.setEmail}  // تحديث القيمة عند الكتابة
      keyboardType="email-address"
      autoCapitalize="none"
      autoCorrect={false}
      error={controller.errors.email}  // رسالة خطأ من API (إذا فشل Login)
      leftIcon={<Image source={MessageIcon} style={styles.inputIcon} />}
    />

    {/* Password Input */}
    {/* عندما يكتب المستخدم، controller.setPassword يتم استدعاؤه */}
    <Input
      placeholder="Enter your password"
      value={controller.password}  // القيمة الحالية من controller
      onChangeText={controller.setPassword}  // تحديث القيمة عند الكتابة
      secureTextEntry
      showPasswordToggle
      error={controller.errors.password}  // رسالة خطأ من API (إذا فشل Login)
      leftIcon={<Image source={LockIcon} style={styles.inputIcon} />}
    />
  </View>
);

export default LoginForm;
