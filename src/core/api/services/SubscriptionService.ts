// ============================================
// Subscription Service - Subscription-related API calls
// ============================================

import { api } from '../apiClient';
import { ENDPOINTS } from '../../constants/AppConstants';

// Types - API Response
export interface ApiSubscriptionPlan {
  _id: string;
  name: string;
  slug: string;
  price: number;
  billingCycle: 'monthly' | 'yearly';
  description: string;
  benefits: {
    accessToAllCourses: boolean;
    certificationOnCompletion: boolean;
    offlineAccess: boolean;
    premiumSupport: boolean;
    exclusiveContent: boolean;
    maxCourses: number | null;
  };
  features: Array<{
    _id: string;
    name: string;
    isIncluded: boolean;
  }>;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

// Types - App Plan Interface
export interface SubscriptionPlan {
  id: string;
  name: string;
  slug: string;
  price: number;
  priceFormatted: string;
  billingCycle: 'monthly' | 'yearly';
  description: string;
  benefits: {
    accessToAllCourses: boolean;
    certificationOnCompletion: boolean;
    offlineAccess: boolean;
    premiumSupport: boolean;
    exclusiveContent: boolean;
    maxCourses: number | null;
  };
  features: string[];
  isPremium: boolean;
  isActive: boolean;
  sortOrder: number;
}

export interface SubscriptionPlansResponse {
  plans: SubscriptionPlan[];
}

// API Response wrapper
export interface ApiSubscriptionPlansResponse {
  plans: ApiSubscriptionPlan[];
}

// Current Subscription Response
export interface CurrentSubscriptionResponse {
  subscription: {
    plan: string;
    isActive: boolean;
  };
}

// Helper function to convert API plan to app plan
const mapApiPlanToPlan = (apiPlan: ApiSubscriptionPlan): SubscriptionPlan => {
  // Determine if plan is premium (usually the highest tier)
  const isPremium = apiPlan.slug === 'premium';
  
  // Format price
  const priceFormatted = `$${apiPlan.price.toFixed(2)}`;
  
  // Extract feature names
  const features = apiPlan.features
    .filter(feature => feature.isIncluded)
    .map(feature => feature.name);

  return {
    id: apiPlan._id,
    name: apiPlan.name,
    slug: apiPlan.slug,
    price: apiPlan.price,
    priceFormatted,
    billingCycle: apiPlan.billingCycle,
    description: apiPlan.description,
    benefits: apiPlan.benefits,
    features,
    isPremium,
    isActive: apiPlan.isActive,
    sortOrder: apiPlan.sortOrder,
  };
};

// Subscription Service
export const SubscriptionService = {
  /**
   * Get all subscription plans
   */
  getPlans: async (): Promise<SubscriptionPlan[]> => {
    const response = await api.get<ApiSubscriptionPlansResponse>(ENDPOINTS.SUBSCRIPTION_PLANS);
    // apiClient interceptor already extracts data.data, so response.data is ApiSubscriptionPlansResponse
    const apiPlans = response.data.plans;
    const plans = apiPlans.map(mapApiPlanToPlan);
    
    // Sort by sortOrder
    return plans.sort((a, b) => a.sortOrder - b.sortOrder);
  },

  /**
   * Subscribe to a plan
   */
  subscribe: async (planId: string): Promise<{ success: boolean; message: string; data?: any }> => {
    const response = await api.post<{ success: boolean; message: string; data?: any }>(
      ENDPOINTS.SUBSCRIBE,
      { planId }
    );
    return response.data;
  },

  /**
   * Get current subscription
   */
  getCurrentSubscription: async (): Promise<CurrentSubscriptionResponse | null> => {
    try {
      const response = await api.get<CurrentSubscriptionResponse>(ENDPOINTS.CURRENT_SUBSCRIPTION);
      // apiClient interceptor already extracts data.data, so response.data is CurrentSubscriptionResponse
      return (response as any).data || null;
    } catch (error) {
      // If no subscription found or error, return null
      return null;
    }
  },
};

export default SubscriptionService;
