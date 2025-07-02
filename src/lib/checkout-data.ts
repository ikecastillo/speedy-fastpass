import { plans, type Plan } from "@/types/plan";
import { type VehicleForm } from "@/types/vehicle";

// Unified checkout data structure
export interface CheckoutData {
  plan: {
    name: string;
    displayName: string;
    period: 'monthly' | 'yearly';
    price: number;
    index: number;
  };
  vehicle?: VehicleForm;
  step: 'plan' | 'vehicle' | 'payment' | 'success';
}

// Single localStorage key for all checkout data
const CHECKOUT_DATA_KEY = 'speedyCheckoutData';

// Helper function to normalize plan names
export function normalizePlanName(planName: string): string {
  return planName.toLowerCase().replace('+', '-plus');
}

// Helper function to get display name from normalized name
export function getDisplayPlanName(normalizedName: string): string {
  const plan = plans.find(p => normalizePlanName(p.name) === normalizedName);
  return plan?.name || normalizedName;
}

// Helper function to calculate price
export function calculatePlanPrice(plan: Plan, period: 'monthly' | 'yearly'): number {
  return period === 'yearly' ? plan.monthlyPrice * 10 : plan.monthlyPrice;
}

// Save checkout data to localStorage
export function saveCheckoutData(data: Partial<CheckoutData>): void {
  if (typeof window === 'undefined') return;
  
  const existingData = getCheckoutData();
  const updatedData = { ...existingData, ...data };
  
  try {
    localStorage.setItem(CHECKOUT_DATA_KEY, JSON.stringify(updatedData));
    console.log('✅ Checkout data saved:', updatedData);
  } catch (error) {
    console.error('❌ Failed to save checkout data:', error);
  }
}

// Get checkout data from localStorage
export function getCheckoutData(): CheckoutData | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const data = localStorage.getItem(CHECKOUT_DATA_KEY);
    if (!data) return null;
    
    const parsed = JSON.parse(data);
    console.log('📋 Retrieved checkout data:', parsed);
    return parsed;
  } catch (error) {
    console.error('❌ Failed to parse checkout data:', error);
    return null;
  }
}

// Save plan selection
export function savePlanSelection(planIndex: number, billingPeriod: number): void {
  if (planIndex < 0 || planIndex >= plans.length) {
    console.error('❌ Invalid plan index:', planIndex);
    return;
  }
  
  const selectedPlan = plans[planIndex];
  const period: 'monthly' | 'yearly' = billingPeriod === 0 ? 'monthly' : 'yearly';
  const price = calculatePlanPrice(selectedPlan, period);
  
  const planData = {
    name: normalizePlanName(selectedPlan.name),
    displayName: selectedPlan.name,
    period,
    price,
    index: planIndex,
  };
  
  saveCheckoutData({
    plan: planData,
    step: 'plan'
  });
}

// Save vehicle form data
export function saveVehicleData(vehicleData: VehicleForm): void {
  saveCheckoutData({
    vehicle: vehicleData,
    step: 'vehicle'
  });
}

// Get plan data for components that need it
export function getPlanData(): { activePlan: number | null; billingPeriod: number } | null {
  const checkoutData = getCheckoutData();
  if (!checkoutData?.plan) return null;
  
  return {
    activePlan: checkoutData.plan.index,
    billingPeriod: checkoutData.plan.period === 'yearly' ? 1 : 0
  };
}

// Clear all checkout data
export function clearCheckoutData(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(CHECKOUT_DATA_KEY);
    console.log('🗑️ Checkout data cleared');
  } catch (error) {
    console.error('❌ Failed to clear checkout data:', error);
  }
}

// Validate that we have complete data for payment
export function validateCheckoutData(): { isValid: boolean; missingData: string[] } {
  const data = getCheckoutData();
  const missingData: string[] = [];
  
  if (!data) {
    return { isValid: false, missingData: ['all checkout data'] };
  }
  
  if (!data.plan) {
    missingData.push('plan selection');
  }
  
  if (!data.vehicle) {
    missingData.push('vehicle information');
  }
  
  return { isValid: missingData.length === 0, missingData };
}

// Migrate old localStorage data to new format (for backward compatibility)
export function migrateOldCheckoutData(): void {
  if (typeof window === 'undefined') return;
  
  try {
    // Check for old data format
    const oldPlanData = localStorage.getItem('selectedPlan');
    const oldVehicleData = localStorage.getItem('vehicleFormData');
    
    if (oldPlanData || oldVehicleData) {
      console.log('🔄 Migrating old checkout data...');
      
      let migratedData: Partial<CheckoutData> = {};
      
      // Migrate plan data
      if (oldPlanData) {
        try {
          const parsed = JSON.parse(oldPlanData);
          const planName = parsed.name || parsed.plan;
          const period: 'monthly' | 'yearly' = parsed.period === 'yearly' ? 'yearly' : 'monthly';
          
          // Find the plan index
          const planIndex = plans.findIndex(plan => 
            normalizePlanName(plan.name) === normalizePlanName(planName)
          );
          
          if (planIndex >= 0) {
            const selectedPlan = plans[planIndex];
            migratedData.plan = {
              name: normalizePlanName(selectedPlan.name),
              displayName: selectedPlan.name,
              period,
              price: calculatePlanPrice(selectedPlan, period),
              index: planIndex,
            };
          }
        } catch (error) {
          console.error('Failed to migrate plan data:', error);
        }
      }
      
      // Migrate vehicle data
      if (oldVehicleData) {
        try {
          const parsed = JSON.parse(oldVehicleData);
          migratedData.vehicle = parsed;
        } catch (error) {
          console.error('Failed to migrate vehicle data:', error);
        }
      }
      
      // Save migrated data
      if (Object.keys(migratedData).length > 0) {
        migratedData.step = oldVehicleData ? 'vehicle' : 'plan';
        saveCheckoutData(migratedData);
        
        // Clean up old data
        localStorage.removeItem('selectedPlan');
        localStorage.removeItem('vehicleFormData');
        localStorage.removeItem('checkoutPlan');
        
        console.log('✅ Migration completed:', migratedData);
      }
    }
  } catch (error) {
    console.error('❌ Failed to migrate old checkout data:', error);
  }
} 