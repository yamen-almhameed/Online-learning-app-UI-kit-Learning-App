/**
 * ============================================
 * 💡 أمثلة عملية لاستخدام شاشات الدفع
 * ============================================
 * انسخ والصق في شاشاتك حسب الحاجة
 */

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

// ============================================
// مثال 1: زر Premium في Profile
// ============================================
export const PremiumButton = ({ navigation, isPremium }: any) => {
  if (isPremium) {
    return (
      <View style={styles.premiumBadge}>
        <Icon name="star" size={20} color="#FFD700" />
        <Text style={styles.premiumText}>Premium Member</Text>
      </View>
    );
  }

  return (
    <TouchableOpacity
      style={styles.upgradeButton}
      onPress={() => navigation.navigate('SubscriptionPlans')}
    >
      <Icon name="upgrade" size={24} color="#FFFFFF" />
      <Text style={styles.upgradeText}>Upgrade to Premium</Text>
    </TouchableOpacity>
  );
};

// ============================================
// مثال 2: Premium Card في الكورس
// ============================================
export const PremiumCourseCard = ({ navigation, course }: any) => {
  return (
    <View style={styles.courseCard}>
      <View style={styles.premiumOverlay}>
        <Icon name="lock" size={40} color="#FFFFFF" />
        <Text style={styles.premiumOnlyText}>Premium Only</Text>
        <TouchableOpacity
          style={styles.unlockButton}
          onPress={() => navigation.navigate('SubscriptionPlans')}
        >
          <Text style={styles.unlockText}>Unlock Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// ============================================
// مثال 3: Banner في أعلى الشاشة
// ============================================
export const PremiumBanner = ({ navigation, onClose }: any) => {
  return (
    <View style={styles.banner}>
      <View style={styles.bannerContent}>
        <Icon name="stars" size={28} color="#FFD700" />
        <View style={styles.bannerText}>
          <Text style={styles.bannerTitle}>Unlock Premium Features!</Text>
          <Text style={styles.bannerSubtitle}>
            Get unlimited access to all courses
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.bannerButton}
        onPress={() => navigation.navigate('SubscriptionPlans')}
      >
        <Text style={styles.bannerButtonText}>Upgrade</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Icon name="close" size={20} color="#666" />
      </TouchableOpacity>
    </View>
  );
};

// ============================================
// مثال 4: Modal للترقية
// ============================================
export const UpgradeModal = ({ visible, onClose, navigation }: any) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Icon name="workspace-premium" size={60} color="#167F71" />
          <Text style={styles.modalTitle}>Upgrade to Premium</Text>
          <Text style={styles.modalDescription}>
            Get access to exclusive content and features
          </Text>

          <View style={styles.featuresList}>
            <FeatureItem text="Access to all courses" />
            <FeatureItem text="Download for offline" />
            <FeatureItem text="Certificate on completion" />
            <FeatureItem text="Premium support" />
          </View>

          <TouchableOpacity
            style={styles.modalButton}
            onPress={() => {
              onClose();
              navigation.navigate('SubscriptionPlans');
            }}
          >
            <Text style={styles.modalButtonText}>See Plans</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.modalCloseButton} onPress={onClose}>
            <Text style={styles.modalCloseText}>Maybe Later</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const FeatureItem = ({ text }: { text: string }) => (
  <View style={styles.featureItem}>
    <Icon name="check-circle" size={20} color="#167F71" />
    <Text style={styles.featureText}>{text}</Text>
  </View>
);

// ============================================
// مثال 5: استخدام في شاشة كاملة
// ============================================
export const ProfileScreenExample = ({ navigation }: any) => {
  const [isPremium, setIsPremium] = React.useState(false);
  const [showBanner, setShowBanner] = React.useState(!isPremium);

  return (
    <View style={styles.container}>
      {/* Premium Banner */}
      {showBanner && !isPremium && (
        <PremiumBanner
          navigation={navigation}
          onClose={() => setShowBanner(false)}
        />
      )}

      {/* Profile Content */}
      <View style={styles.profileContent}>
        {/* Premium Status */}
        <PremiumButton navigation={navigation} isPremium={isPremium} />

        {/* Settings Options */}
        <TouchableOpacity
          style={styles.settingItem}
          onPress={() => navigation.navigate('SubscriptionPlans')}
        >
          <Icon name="card-membership" size={24} color="#167F71" />
          <Text style={styles.settingText}>Manage Subscription</Text>
          <Icon name="chevron-right" size={24} color="#999" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

// ============================================
// 🎨 Styles
// ============================================
const styles = StyleSheet.create({
  // Premium Button
  upgradeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#167F71',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 25,
    marginVertical: 16,
    shadowColor: '#167F71',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  upgradeText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  premiumText: {
    color: '#B8860B',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },

  // Course Card
  courseCard: {
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
  },
  premiumOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  premiumOnlyText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 20,
  },
  unlockButton: {
    backgroundColor: '#167F71',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 25,
  },
  unlockText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // Banner
  banner: {
    backgroundColor: '#FFF9E6',
    borderRadius: 16,
    padding: 16,
    margin: 16,
    borderWidth: 2,
    borderColor: '#FFD700',
    position: 'relative',
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  bannerText: {
    flex: 1,
    marginLeft: 12,
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F1F1F',
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: 13,
    color: '#666',
  },
  bannerButton: {
    backgroundColor: '#167F71',
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
  },
  bannerButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  closeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 4,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 32,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F1F1F',
    marginTop: 16,
    marginBottom: 8,
  },
  modalDescription: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  featuresList: {
    width: '100%',
    marginBottom: 24,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    fontSize: 15,
    color: '#1F1F1F',
    marginLeft: 12,
  },
  modalButton: {
    backgroundColor: '#167F71',
    paddingHorizontal: 48,
    paddingVertical: 14,
    borderRadius: 25,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalCloseButton: {
    marginTop: 16,
  },
  modalCloseText: {
    color: '#999',
    fontSize: 15,
  },

  // Profile Screen
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  profileContent: {
    padding: 20,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginTop: 12,
  },
  settingText: {
    flex: 1,
    fontSize: 16,
    color: '#1F1F1F',
    marginLeft: 12,
  },
});

// ============================================
// 📝 كيفية الاستخدام:
// ============================================

/*
// في ملف ProfileScreen.tsx:
import { PremiumButton, PremiumBanner } from '../components/PremiumComponents';

const ProfileScreen = ({ navigation }) => {
  const [isPremium, setIsPremium] = useState(false);
  
  return (
    <View>
      {!isPremium && <PremiumBanner navigation={navigation} />}
      <PremiumButton navigation={navigation} isPremium={isPremium} />
    </View>
  );
};

// في ملف CourseCard.tsx:
import { PremiumCourseCard } from '../components/PremiumComponents';

const CourseCard = ({ course, navigation }) => {
  if (course.isPremium && !userIsPremium) {
    return <PremiumCourseCard navigation={navigation} course={course} />;
  }
  
  return <RegularCourseCard course={course} />;
};
*/

