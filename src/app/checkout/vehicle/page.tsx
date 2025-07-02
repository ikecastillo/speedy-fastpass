"use client";

import React from "react";
import Image from "next/image";
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
    <div className="min-h-screen bg-white pb-32">
      {/* Hero section matching home page style */}
      <div className="fixed inset-x-0 top-0 h-48 md:h-64 z-0 overflow-hidden">
        <Image 
          src="/SpeedyAtDay.PNG" 
          alt="Speedy Wash exterior" 
          fill 
          className="object-cover" 
          priority 
          sizes="100vw" 
        />
        
        {/* Location Badge Overlay */}
        <div className="absolute top-4 right-4 z-10">
          <div className="bg-white/20 backdrop-blur-md rounded-full px-3 py-2 shadow-sm border border-white/30">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-semibold text-white drop-shadow-sm">Round Rock, Texas</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main content with header matching home page */}
      <div className="relative z-10 pt-48 md:pt-64">
        {/* Modern App-Style Header */}
        <div className="relative -mt-5 z-10">
          <div 
            className="bg-white md:mx-8 pt-8 pb-6 px-6"
            style={{
              backgroundColor: '#ffffff',
              borderTopLeftRadius: '2rem',
              borderTopRightRadius: '2rem',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
            }}
          >
            {/* Header Content */}
            <div className="text-center mb-6">
              {/* Main Brand Logo */}
              <div className="flex items-start justify-center gap-1 mb-4">
                <h1 
                  className="text-2xl sm:text-3xl font-bold uppercase tracking-tight italic"
                  style={{ 
                    color: '#0B2545',
                    letterSpacing: '-0.02em'
                  }}
                >
                  Speedy
                </h1>
                <h1 
                  className="text-2xl sm:text-3xl font-bold uppercase tracking-tight"
                  style={{ 
                    color: '#0B2545',
                    letterSpacing: '-0.02em'
                  }}
                >
                  Wash
                </h1>
                <span 
                  className="text-lg font-bold"
                  style={{ 
                    color: '#FFD60A',
                    marginTop: '-4px',
                    marginLeft: '2px'
                  }}
                >
                  +
                </span>
              </div>
              
              {/* CTA Section */}
              <div 
                className="inline-block px-6 py-3 rounded-2xl mb-2"
                style={{
                  background: 'linear-gradient(135deg, #0B2545 0%, #1463B4 100%)',
                  boxShadow: '0 4px 16px rgba(11, 37, 69, 0.15)',
                }}
              >
                <h2 className="text-lg font-bold text-white mb-1">
                  Complete Your Registration
                </h2>
                <p className="text-sm text-blue-100 opacity-90">
                  Just a few details to get you washing
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Pure white content area for form */}
        <div style={{ backgroundColor: '#ffffff' }}>
          {/* Single-screen form container - optimized height */}
          <div className="px-4 md:px-8 pb-8">
            <div className="max-w-2xl mx-auto">
              <VehicleFormComponent />
            </div>
          </div>
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