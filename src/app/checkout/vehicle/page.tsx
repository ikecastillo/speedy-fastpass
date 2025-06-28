"use client";

import React from "react";
import { Stepper } from "@/components/Stepper";
import { VehicleFormComponent } from "@/components/VehicleForm";
import { PlanSummary } from "@/components/PlanSummary";

export default function VehiclePage() {
  const [planData, setPlanData] = React.useState<{name: string; period: 'monthly' | 'yearly'} | null>(null);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedPlan = localStorage.getItem('selectedPlan');
      if (storedPlan) {
        const parsed = JSON.parse(storedPlan);
        setPlanData({
          name: parsed.name || parsed.plan,
          period: parsed.period
        });
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Stepper currentStep={2} />
      <div className="max-w-6xl mx-auto px-4 py-4 md:p-8">
        <h1 className="text-lg md:text-2xl font-bold text-gray-900 mb-4 md:mb-8">
          Vehicle & Personal Information
        </h1>
        
        {/* Mobile-first: Plan Summary at top, then form */}
        <div className="space-y-4 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Plan Summary - Mobile: full width at top, Desktop: 1/3 width sidebar */}
          <div className="lg:col-span-1 lg:order-2">
            {planData ? (
              <div className="sticky top-4">
                <PlanSummary planName={planData.name} period={planData.period} />
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
                <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4">Selected Plan</h3>
                <p className="text-gray-600">Loading plan information...</p>
              </div>
            )}
          </div>
          
          {/* Main Form - Mobile: below summary, Desktop: 2/3 width */}
          <div className="lg:col-span-2 lg:order-1">
            <div className="bg-white rounded-lg shadow-md p-4 md:p-8">
              <VehicleFormComponent />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 