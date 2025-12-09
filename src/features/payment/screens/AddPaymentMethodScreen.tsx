import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import HeaderBar from '../../../shared/components/molecules/HeaderBar';
import { Colors } from '../../../core/theme/colors';
import { api } from '../../../core/api/apiClient';
import { ENDPOINTS } from '../../../core/constants/AppConstants';

// Payment Icons
const VisaIcon = require('../../../shared/assets/icons/visa.png');
const PayPalIcon = require('../../../shared/assets/icons/paypal.png');
const GpayIcon = require('../../../shared/assets/icons/Gpay.png');

// Form Input Icons
const IconVisa = require('../../../shared/assets/icons/icon_visa.png');
const IconUser = require('../../../shared/assets/icons/icon_user.png');
const IconCalendar = require('../../../shared/assets/icons/calender.png');

// Success Icon
const SuccessIcon = require('../../../shared/assets/icons/Mask group.png');

// Types
interface AddPaymentMethodScreenProps {
  navigation: any;
  route?: {
    params?: {
      planId?: string;
    };
  };
}

const AddPaymentMethodScreen: React.FC<AddPaymentMethodScreenProps> = ({ navigation, route }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState('visa');
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleExpiryDateChange = (text: string) => {
    const numericText = text.replace(/[^0-9]/g, '');
    if (numericText.length <= 4) {
      let formatted = numericText;
      if (numericText.length > 2) {
        formatted = `${numericText.slice(0, 2)}/${numericText.slice(2)}`;
      }
      setExpiryDate(formatted);
    }
  };

  const handleCvvChange = (text: string) => {
    const numericText = text.replace(/[^0-9]/g, '');
    if (numericText.length <= 3) {
      setCvv(numericText);
    }
  };

  const handleCardNumberChange = (text: string) => {
    const numericText = text.replace(/[^0-9]/g, '');
    if (numericText.length <= 16) {
      setCardNumber(numericText);
    }
  };

  const handlePayment = async () => {
    if (!cardNumber.trim()) {
      Alert.alert('Error', 'Please enter card number');
      return;
    }
    if (!cardHolder.trim()) {
      Alert.alert('Error', 'Please enter card holder name');
      return;
    }
    if (!expiryDate.trim()) {
      Alert.alert('Error', 'Please enter expiry date');
      return;
    }
    if (!cvv.trim()) {
      Alert.alert('Error', 'Please enter CVV');
      return;
    }

    try {
      setLoading(true);
      
      let formattedExpiryDate = expiryDate;
      if (expiryDate.length === 4 && !expiryDate.includes('/')) {
        formattedExpiryDate = `${expiryDate.slice(0, 2)}/${expiryDate.slice(2)}`;
      }

      const planId = route?.params?.planId;
      const paymentData: any = {
        type: selectedPayment,
        cardNumber: cardNumber.trim(),
        cardHolder: cardHolder.trim(),
        expiryDate: formattedExpiryDate,
        isDefault: true,
      };

      // Add planId if provided (required for subscription)
      if (planId) {
        paymentData.planId = planId;
      }

      const response = await api.post(ENDPOINTS.USER_PAYMENT_METHODS, paymentData);

      if (response && (response as any).success !== false) {
        setModalVisible(true);
      } else {
        throw new Error((response as any).message || 'Failed to add payment method');
      }
    } catch (error: any) {
      console.error('Error adding payment method:', error);
      Alert.alert(
        'Error',
        error?.message || 'Failed to add payment method. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const goToCourses = () => {
    setModalVisible(false);
    navigation?.navigate('MyCourses');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <HeaderBar
        title=" Add Payment Method "
        showBackButton
        showNotificationButton
        onBackPress={() => navigation?.goBack()}
        backgroundColor={Colors.textWhite}
        backIconColor={Colors.textPrimary}
      />

      <View style={styles.content}>
        {/* Title */}
        <Text style={styles.title}>Add Payment Method</Text>
        <Text style={styles.subtitle}>
          Provide Your Payment Method Details Below
        </Text>

        {/* Payment Type Selection */}
        <View style={styles.paymentTypeContainer}>
          <Text style={styles.paymentTypeLabel}>Payment Type</Text>
          <View style={styles.paymentOptions}>
            {/* Visa */}
            <TouchableOpacity
              style={styles.paymentOption}
              onPress={() => setSelectedPayment('visa')}
              activeOpacity={0.8}
            >
              <View style={[
                styles.radioButton,
                selectedPayment === 'visa' && styles.radioButtonSelected
              ]}>
                {selectedPayment === 'visa' && <View style={styles.radioButtonInner} />}
              </View>
              <Image source={VisaIcon} style={styles.paymentIconPaypal} resizeMode="contain" />
            </TouchableOpacity>

            {/* PayPal */}
            <TouchableOpacity
              style={styles.paymentOption}
              onPress={() => setSelectedPayment('paypal')}
              activeOpacity={0.7}
            >
              <View style={[
                styles.radioButton,
                selectedPayment === 'paypal' && styles.radioButtonSelected
              ]}>
                {selectedPayment === 'paypal' && <View style={styles.radioButtonInner} />}
              </View>
              <Image source={PayPalIcon} style={styles.paymentIcon} resizeMode="contain" />
            </TouchableOpacity>

            {/* Google Pay */}
            <TouchableOpacity
              style={styles.paymentOption}
              onPress={() => setSelectedPayment('gpay')}
              activeOpacity={0.7}
            >
              <View style={[
                styles.radioButton,
                selectedPayment === 'gpay' && styles.radioButtonSelected
              ]}>
                {selectedPayment === 'gpay' && <View style={styles.radioButtonInner} />}
              </View>
              <Image source={GpayIcon} style={styles.paymentIcon} resizeMode="contain" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Card Number */}
          <View style={[
            styles.inputContainer,
            focusedInput === 'cardNumber' && styles.inputContainerFocused
          ]}>
            <Image source={IconVisa} style={styles.inputIconImage} resizeMode="contain" />
            <TextInput
              style={styles.input}
              placeholder="Enter Card Number"
              keyboardType="numeric"
              placeholderTextColor="#B5B5B5"
              value={cardNumber}
              onChangeText={handleCardNumberChange}
              onFocus={() => setFocusedInput('cardNumber')}
              onBlur={() => setFocusedInput(null)}
              maxLength={16}
            />
          </View>

          {/* Card Holder Name */}
          <View style={[
            styles.inputContainer,
            focusedInput === 'cardHolder' && styles.inputContainerFocused
          ]}>
            <Image source={IconUser} style={styles.inputIconImage} resizeMode="contain" />
            <TextInput
              style={styles.input}
              placeholder="Enter Card Holder Name"
              placeholderTextColor="#B5B5B5"
              value={cardHolder}
              onChangeText={setCardHolder}
              onFocus={() => setFocusedInput('cardHolder')}
              onBlur={() => setFocusedInput(null)}
            />
          </View>

          {/* Expiry Date */}
          <View style={[
            styles.inputContainer,
            focusedInput === 'expiryDate' && styles.inputContainerFocused
          ]}>
            <Image source={IconCalendar} style={styles.inputIconImage} resizeMode="contain" />
            <TextInput
              style={styles.input}
              placeholder="MM/YY"
              placeholderTextColor="#B5B5B5"
              keyboardType="number-pad"
              value={expiryDate}
              onChangeText={handleExpiryDateChange}
              onFocus={() => setFocusedInput('expiryDate')}
              onBlur={() => setFocusedInput(null)}
              maxLength={5}
            />
          </View>

          {/* CVV */}
          <View style={[
            styles.inputContainer,
            focusedInput === 'cvv' && styles.inputContainerFocused
          ]}>
            <Image source={IconCalendar} style={styles.inputIconImage} resizeMode="contain" />
            <TextInput
              style={styles.input}
              placeholder="Enter CVV"
              placeholderTextColor="#B5B5B5"
              keyboardType="number-pad"
              secureTextEntry
              value={cvv}
              onChangeText={handleCvvChange}
              onFocus={() => setFocusedInput('cvv')}
              onBlur={() => setFocusedInput(null)}
              maxLength={3}
            />
          </View>
        </View>

        <TouchableOpacity
          onPress={handlePayment}
          activeOpacity={0.8}
          style={styles.proceedButtonContainer}
          disabled={loading}
        >
          <LinearGradient
            colors={['#087E8B', '#0B3954']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.proceedButton}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.proceedButtonText}>Proceed to Payment</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable 
          style={styles.modalOverlay} 
          onPress={() => setModalVisible(false)}
        >
          <Pressable style={styles.modalContent} onPress={() => {}}>
            <View style={styles.successIconContainer}>
              <Image 
                source={SuccessIcon} 
                style={styles.successIconImage} 
                resizeMode="contain" 
              />
            </View>

            <Text style={styles.modalTitle}>
              Your Subscription is Successful!
            </Text>
            <Text style={styles.modalSubtitle}>
              Enjoy Unlimited Access.
            </Text>

            <TouchableOpacity 
              style={styles.modalButton} 
              onPress={goToCourses}
              activeOpacity={0.8}
            >
              <Text style={styles.modalButtonText}>Go to Courses</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F1F1',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  title: {
    fontSize: 22,
    color: Colors.textPrimary,
    letterSpacing: 1.5,
    fontFamily: 'ClashDisplay-Semibold',
  },
  subtitle: {
    fontFamily: 'ClashDisplay-Regular',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 14 * 1.2,
    letterSpacing: 14 * 0.02,
    textTransform: 'capitalize',
  },
  paymentTypeContainer: {
    marginBottom: 30,
  },
  paymentTypeLabel: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 25,
    letterSpacing: 0,
    color: '#6E6E6E',
    fontFamily: 'Montserrat-SemiBold',
    marginVertical: 12,
  },
  paymentOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 20,
  },
  paymentOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 56,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#CCCCCC',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.transparent,
  },
  radioButtonSelected: {
    borderColor: Colors.buttonPrimary,
    backgroundColor: Colors.buttonPrimary,
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
  },
  paymentIcon: {
    flex: 1,
    height: 64,
    maxWidth: 64,
  },
  paymentIconPaypal: {
    flex: 1,
    height: 64,
    maxWidth: 55,
  },
  form: {
    paddingHorizontal: 0,
  },
  inputContainer: {
    width: '100%',
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    opacity: 1,
  },
  
  inputContainerFocused: {
    borderColor: '#167F71',
  },
  inputIconImage: {
    width: 20,
    height: 20,
    marginRight: 12,
    tintColor: '#B5B5B5',
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#1F1F1F',
    fontFamily: 'Montserrat-Regular',
  },
  proceedButtonContainer: {
    marginHorizontal: 20,
    marginTop: 40,
    borderRadius: 28,
    shadowColor: '#087E8B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  proceedButton: {
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  proceedButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 2,
    fontFamily: 'Montserrat-Bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
  },
  successIconContainer: {
    marginBottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successIconImage: {
    width: 120,
    height: 120,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1F1F1F',
    textAlign: 'center',
    marginBottom: 10,
    fontFamily: 'Montserrat-Bold',
  },
  modalSubtitle: {
    fontSize: 15,
    fontWeight: '400',
    color: '#757575',
    textAlign: 'center',
    marginBottom: 32,
    fontFamily: 'Montserrat-Regular',
  },
  modalButton: {
    backgroundColor: Colors.buttonPrimary,
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 28,
    minWidth: 200,
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    fontFamily: 'Montserrat-Bold',
  },
});

export default AddPaymentMethodScreen;

