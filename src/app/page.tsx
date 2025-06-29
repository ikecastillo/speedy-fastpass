"use client";

import { PlanDetailsCard } from "@/components/PlanDetailsCard";
import { PricingSelector } from "@/components/PricingSelector";
import { useState } from "react";

export default function HomePage() {
  const [activePlan, setActivePlan] = useState<number | null>(null);
  const [billingPeriod, setBillingPeriod] = useState(0); // 0 = Monthly, 1 = Yearly

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Full-width hero section */}
      <PlanDetailsCard 
        selectedPlanIndex={activePlan} 
        billingPeriod={billingPeriod === 0 ? 'monthly' : 'yearly'} 
      />
      
      {/* Centered pricing selector container */}
      <div className="flex items-center justify-center px-4 py-8">
        <PricingSelector 
          activePlan={activePlan}
          setActivePlan={setActivePlan}
          billingPeriod={billingPeriod}
          setBillingPeriod={setBillingPeriod}
        />
      </div>
    </div>
  );
}
