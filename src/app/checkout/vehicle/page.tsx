"use client";

import React from "react";
import { Stepper } from "@/components/Stepper";
import { VehicleFormComponent } from "@/components/VehicleForm";
import { PersistentPlanBar } from "@/components/PersistentPlanBar";
import { plans } from "@/types/plan";

export default function VehiclePage() {
  const [planData, setPlanData] = React.useState<{
    activePlan: number | null;
    billingPeriod: number;
  }>({
    activePlan: null,
    billingPeriod: 0
  });

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedPlan = localStorage.getItem('selectedPlan');
      if (storedPlan) {
        const parsed = JSON.parse(storedPlan);
        const planName = parsed.name || parsed.plan;
        
        // Find the plan index based on the stored plan name
        const planIndex = plans.findIndex(plan => 
          plan.name.toLowerCase().replace('+', '-plus') === planName.toLowerCase()
        );
        
        setPlanData({
          activePlan: planIndex >= 0 ? planIndex : null,
          billingPeriod: parsed.period === 'yearly' ? 1 : 0
        });
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      <Stepper currentStep={2} />
      <div className="max-w-4xl mx-auto px-4 py-4 md:p-8">
        <h1 className="text-lg md:text-2xl font-bold text-gray-900 mb-4 md:mb-8">
          Vehicle & Personal Information
        </h1>
        
        {/* Full-width form - no sidebar since plan info is in persistent bar */}
        <div className="bg-white rounded-lg shadow-md p-4 md:p-8">
          <VehicleFormComponent />
        </div>
      </div>

      {/* Persistent Plan Bar */}
      <PersistentPlanBar 
        activePlan={planData.activePlan}
        billingPeriod={planData.billingPeriod}
        currentStep="vehicle"
        continueText="Continue to Payment"
        onContinue={() => {
          // Navigate to payment page
          window.location.href = '/checkout/payment';
        }}
      />
    </div>
  );
} 