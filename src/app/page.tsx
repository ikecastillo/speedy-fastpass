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
