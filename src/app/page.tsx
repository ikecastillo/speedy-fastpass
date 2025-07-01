"use client";

import { PlanDetailsCard } from "@/components/PlanDetailsCard";
import { PricingSelector } from "@/components/PricingSelector";
import { useState } from "react";
import Image from "next/image";

export default function HomePage() {
  const [activePlan, setActivePlan] = useState<number | null>(null);
  const [billingPeriod, setBillingPeriod] = useState(0); // 0 = Monthly, 1 = Yearly

  return (
    <div className="min-h-screen bg-white">
      {/* Fixed hero – 16 rem tall */}
      <div className="fixed inset-x-0 top-0 h-64 md:h-80 z-0 overflow-hidden">
        <Image src="/SpeedyAtDay.PNG" alt="Speedy Wash exterior" fill className="object-cover" priority sizes="100vw" />
        
        {/* Location Badge Overlay */}
        <div className="absolute top-4 right-4 z-10">
          <div className="bg-white/95 backdrop-blur-sm rounded-full px-3 py-2 shadow-lg border border-white/20">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-semibold text-gray-800">Round Rock, Texas</span>
            </div>
          </div>
        </div>
      </div>

      {/* The rest of the page now needs top padding equal to hero height */}
      <div className="relative z-10 pt-64 md:pt-80">
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
    </div>
  );
}
