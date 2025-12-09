import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SubscriptionService, SubscriptionPlan } from '../../../core/api/services/SubscriptionService';
import { SubscriptionPlansScreenProps } from '../../../navigation/types';
import { ROUTES } from '../../../navigation/AppRoutes';
import { HeaderBar } from '../../../shared/components/molecules/HeaderBar';
import { Colors } from '../../../core/theme/colors';

const SubscriptionPlansScreen: React.FC<SubscriptionPlansScreenProps> = ({ navigation }) => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  useEffect(() => {
    const loadPlans = async () => {
      try {
        setLoading(true);
        const fetchedPlans = await SubscriptionService.getPlans();
        setPlans(fetchedPlans);
        const premiumPlan = fetchedPlans.find(plan => plan.isPremium);
        if (premiumPlan) {
          setSelectedPlan(premiumPlan.id);
        } else if (fetchedPlans.length > 0) {
          setSelectedPlan(fetchedPlans[0].id);
        }
      } catch (error) {
        console.error('Error loading subscription plans:', error);
      } finally {
        setLoading(false);
      }
    };
    loadPlans();
  }, []);

  const handleSubscribe = () => {
    if (selectedPlan) {
      navigation?.navigate(ROUTES.ADD_PAYMENT_METHOD, { planId: selectedPlan });
    }
  };


  const renderPlanCard = (plan: SubscriptionPlan) => {
    const isSelected = selectedPlan === plan.id;
    return (
      <TouchableOpacity
        key={plan.id}
        style={[
          styles.planCard,
          styles.basicCard,
          isSelected && styles.basicCardSelected,
        ]}
        onPress={() => setSelectedPlan(plan.id)}
        activeOpacity={0.9}
      >
        <View style={styles.basicContent}>
          <View style={styles.basicInfo}>
            <Text style={styles.basicPlanName}>{plan.name}</Text>
            <Text style={styles.basicPlanDescription}>{plan.description}</Text>
          </View>
          <View style={styles.basicPriceContainer}>
            <Text style={styles.basicPrice}>{plan.priceFormatted}</Text>
            <Text style={styles.basicPriceLabel}>
              {plan.billingCycle === 'monthly' ? 'Monthly' : 'Yearly'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const selectedPlanDetails = plans.find(plan => plan.id === selectedPlan);

  return (
    <SafeAreaView style={styles.container}>
      <HeaderBar
        title="Subscription Plans"
        showBackButton
        showNotificationButton
        onBackPress={() => navigation?.goBack()}
        backgroundColor={Colors.textWhite}
        backIconColor={Colors.textPrimary}
      />

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Choose The Right Plan For</Text>
        <Text style={styles.title}>Your eLearning Journey.</Text>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#167F71" />
            <Text style={styles.loadingText}>Loading plans...</Text>
          </View>
        ) : plans.length > 0 ? (
          <View style={styles.plansContainer}>
            {plans.map((plan) => renderPlanCard(plan))}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No subscription plans available</Text>
          </View>
        )}

        {selectedPlanDetails && (
          <View style={styles.featuresSection}>
            <View style={styles.featuresContent}>
              <Text style={styles.featuresPlanName}>{selectedPlanDetails.name}</Text>
              <Text style={styles.featuresPlanDescription}>{selectedPlanDetails.description}</Text>

              <View style={styles.featuresList}>
                {selectedPlanDetails.features.map((feature, index) => (
                  <View key={index} style={styles.featureItem}>
                    <View style={styles.checkIconContainer}>
                      <Text style={styles.checkIconText}>✓</Text>
                    </View>
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.priceContainer}>
                <Text style={styles.premiumPrice}>{selectedPlanDetails.priceFormatted}</Text>
                <Text style={styles.premiumPriceLabel}>
                  {selectedPlanDetails.billingCycle === 'monthly' ? 'Monthly' : 'Yearly'}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.subscribeButton}
                onPress={handleSubscribe}
                activeOpacity={0.8}
              >
                <Text style={styles.subscribeButtonText}>Subscribe Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
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
    paddingTop: 30,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1F1F1F',
    paddingHorizontal: 20,
    lineHeight: 34,
    fontFamily: 'Montserrat-Bold',
  },
  plansContainer: {
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 40,
  },
  planCard: {
    borderRadius: 20,
    marginBottom: 16,
    overflow: 'hidden',
  },
  basicCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E8E8E8',
  },
  basicCardSelected: {
    borderColor: '#167F71',
  },
  basicContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  basicInfo: {
    flex: 1,
  },
  basicPlanName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F1F1F',
    marginBottom: 6,
    fontFamily: 'Montserrat-Bold',
  },
  basicPlanDescription: {
    fontSize: 13,
    fontWeight: '400',
    color: '#757575',
    fontFamily: 'Montserrat-Regular',
  },
  basicPriceContainer: {
    alignItems: 'flex-end',
  },
  basicPrice: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F1F1F',
    fontFamily: 'Montserrat-Bold',
  },
  basicPriceLabel: {
    fontSize: 13,
    fontWeight: '400',
    color: '#757575',
    fontFamily: 'Montserrat-Regular',
  },
  featuresList: {
    marginBottom: 24,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  checkIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.6)',
  },
  checkIconText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    lineHeight: 18,
  },
  featureText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
    fontFamily: 'Montserrat-Medium',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  premiumPrice: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginRight: 8,
    fontFamily: 'Montserrat-Bold',
  },
  premiumPriceLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#E0F2F0',
    marginBottom: 4,
    fontFamily: 'Montserrat-Medium',
  },
  subscribeButton: {
    backgroundColor: '#FFFFFF',
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subscribeButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#167F71',
    fontFamily: 'Montserrat-Bold',
  },
  loadingContainer: {
    paddingVertical: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    color: '#757575',
    fontFamily: 'Montserrat-Regular',
  },
  emptyContainer: {
    paddingVertical: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#757575',
    fontFamily: 'Montserrat-Regular',
  },
  featuresSection: {
    marginTop: 20,
    marginHorizontal: 20,
    marginBottom: 40,
    borderRadius: 20,
    backgroundColor: '#167F71',
    shadowColor: '#167F71',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
    overflow: 'hidden',
  },
  featuresContent: {
    padding: 24,
  },
  featuresPlanName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
    fontFamily: 'Montserrat-Bold',
  },
  featuresPlanDescription: {
    fontSize: 14,
    fontWeight: '400',
    color: '#E0F2F0',
    marginBottom: 24,
    fontFamily: 'Montserrat-Regular',
  },
});

export default SubscriptionPlansScreen;

