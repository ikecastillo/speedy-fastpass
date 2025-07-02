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

      {/* Main content with header and pricing selector */}
      <div className="relative z-10 pt-72 md:pt-96">
        {/* Modern App-Style Header */}
        <div 
          className="relative -mt-5 z-10"
        >
          <div 
            className="bg-white md:mx-8 pt-8 pb-6 px-6"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.98) 100%)',
              borderTopLeftRadius: '2rem',
              borderTopRightRadius: '2rem',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              boxShadow: '0 -8px 32px rgba(0,0,0,0.08)',
            }}
          >
            {/* Speedy Wash+ Branding */}
            <div className="text-center mb-4">
              <div className="flex items-start justify-center mb-2">
                <h1 className="text-2xl sm:text-3xl font-bold uppercase tracking-wider" style={{ color: '#0B2545' }}>
                  Speedy Wash
                  <span 
                    className="text-lg sm:text-xl font-bold ml-1"
                    style={{ 
                      color: '#FFD60A',
                      verticalAlign: 'super',
                      fontSize: '0.7em'
                    }}
                  >
                    +
                  </span>
                </h1>
              </div>
              
              {/* Tagline */}
              <div>
                <h2 
                  className="text-lg sm:text-xl font-bold mb-2"
                  style={{ color: '#0B2545' }}
                >
                  Select Your Unlimited Pass
                </h2>
                <p className="text-sm text-gray-600 max-w-sm mx-auto">
                  Get unlimited premium washes with your monthly membership
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Pure white content area for pricing */}
        <div className="bg-white">
          {/* Pricing selector container */}
          <div className="px-4 py-8 bg-white">
            <PricingSelector 
              activePlan={activePlan}
              setActivePlan={setActivePlan}
              billingPeriod={billingPeriod}
              setBillingPeriod={setBillingPeriod}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

