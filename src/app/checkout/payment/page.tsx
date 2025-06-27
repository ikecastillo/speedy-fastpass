"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Stepper } from "@/components/Stepper";
import { PackageSummary } from "@/components/PackageSummary";
import { PaymentFormComponent } from "@/components/PaymentForm";

export default function PaymentPage() {
  const router = useRouter();
  const [planData, setPlanData] = React.useState<{plan: string; period: string} | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      // Try to get plan data from localStorage first (from pricing selector)
      const storedPlan = localStorage.getItem('selectedPlan');
      if (storedPlan) {
        const parsed = JSON.parse(storedPlan);
        setPlanData({
          plan: parsed.plan,
          period: parsed.period
        });
        setIsLoading(false);
        return;
      }

      // Fallback: try to get from checkout plan data
      const checkoutPlan = localStorage.getItem('checkoutPlan');
      if (checkoutPlan) {
        const parsed = JSON.parse(checkoutPlan);
        setPlanData({
          plan: parsed.plan,
          period: parsed.period
        });
        setIsLoading(false);
        return;
      }

      // If no plan data found, redirect to plan selection
      router.push('/plan');
    }
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!planData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">No plan selected</p>
          <button
            onClick={() => router.push('/plan')}
            className="bg-brand text-white px-4 py-2 rounded-lg"
          >
            Select Plan
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Stepper currentStep={3} />
      <div className="max-w-6xl mx-auto p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Package Summary */}
          <div className="order-2 lg:order-1">
            <PackageSummary 
              planName={planData.plan} 
              period={planData.period as 'monthly' | 'yearly'} 
            />
          </div>

          {/* Right Column - Payment Form */}
          <div className="order-1 lg:order-2">
            <PaymentFormComponent 
              planName={planData.plan} 
              period={planData.period as 'monthly' | 'yearly'} 
            />
          </div>
        </div>
      </div>
    </div>
  );
} 