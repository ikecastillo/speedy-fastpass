"use client";

import { PricingSelector } from "@/components/PricingSelector";
import { useState } from "react";
import Image from "next/image";

export default function HomePage() {
  const [activePlan, setActivePlan] = useState<number | null>(null);
  const [billingPeriod, setBillingPeriod] = useState(0); // 0 = Monthly, 1 = Yearly

  return (
    <div className="min-h-screen bg-white">
      {/* Fixed hero – Full height display */}
      <div className="fixed inset-x-0 top-0 h-72 md:h-96 z-0 overflow-hidden">
        <Image src="/SpeedyAtDay.PNG" alt="Speedy Wash exterior" fill className="object-cover" priority sizes="100vw" />
        
        {/* Location Badge Overlay - Transparent */}
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

      {/* Pricing selector with integrated details */}
      <div className="relative z-10 pt-72 md:pt-96">
        <div className="flex items-center justify-center px-4 py-8 bg-white">
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

