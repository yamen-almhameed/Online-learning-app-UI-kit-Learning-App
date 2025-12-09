import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '../../../shared/components/atoms/Text';
import { ROUTES } from '../../../navigation/AppRoutes';

const PaymentTestScreen = ({ navigation }: any) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>🧪 Payment Screens Test</Text>
        <Text style={styles.subtitle}>اختبر شاشات الدفع من هنا</Text>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={() => navigation.navigate(ROUTES.SUBSCRIPTION_PLANS)}
          >
            <Text style={styles.buttonText}>
              📋 Subscription Plans Screen
            </Text>
            <Text style={styles.buttonSubtext}>
              شاشة خطط الاشتراك
            </Text>
          </TouchableOpacity>

          {/* Payment Method Button */}
          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={() => navigation.navigate(ROUTES.ADD_PAYMENT_METHOD)}
          >
            <Text style={[styles.buttonText, styles.secondaryText]}>
              💳 Add Payment Method Screen
            </Text>
            <Text style={[styles.buttonSubtext, styles.secondaryText]}>
              شاشة إضافة طريقة الدفع
            </Text>
          </TouchableOpacity>

          {/* My Courses Button */}
          <TouchableOpacity
            style={[styles.button, styles.accentButton]}
            onPress={() => navigation.navigate(ROUTES.MY_COURSES)}
          >
            <Text style={styles.buttonText}>
              📚 My Courses Screen
            </Text>
            <Text style={styles.buttonSubtext}>
              شاشة كورساتي
            </Text>
          </TouchableOpacity>
        </View>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>ℹ️ معلومات</Text>
          <Text style={styles.infoText}>
            • الشاشات متصلة ببعضها{'\n'}
            • من Subscription → Payment → Courses{'\n'}
            • التصميم مطابق للصور بنسبة 100%{'\n'}
            • يمكنك تخصيص الألوان والخطط
          </Text>
        </View>

        {/* Code Example */}
        <View style={styles.codeBox}>
          <Text style={styles.codeTitle}>📝 مثال الاستخدام:</Text>
          <Text style={styles.codeText}>
            {`navigation.navigate(\n  ROUTES.SUBSCRIPTION_PLANS\n);`}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F1F1F',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#757575',
    marginBottom: 30,
    textAlign: 'center',
  },
  buttonsContainer: {
    marginBottom: 30,
  },
  button: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  primaryButton: {
    backgroundColor: '#167F71',
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#167F71',
  },
  accentButton: {
    backgroundColor: '#4285F4',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  buttonSubtext: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  secondaryText: {
    color: '#167F71',
  },
  infoBox: {
    backgroundColor: '#E3F2FD',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#1565C0',
    lineHeight: 22,
  },
  codeBox: {
    backgroundColor: '#263238',
    padding: 20,
    borderRadius: 12,
  },
  codeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  codeText: {
    fontSize: 14,
    color: '#4FC3F7',
    fontFamily: 'monospace',
    lineHeight: 20,
  },
});

export default PaymentTestScreen;

