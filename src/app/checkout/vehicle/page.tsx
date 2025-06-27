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
      <div className="max-w-6xl mx-auto p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">
          Vehicle & Personal Information
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form - 2/3 width */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-8">
              <VehicleFormComponent />
            </div>
          </div>
          
          {/* Plan Summary - 1/3 width */}
          <div className="lg:col-span-1">
            {planData ? (
              <PlanSummary planName={planData.name} period={planData.period} />
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Selected Plan</h3>
                <p className="text-gray-600">Loading plan information...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 