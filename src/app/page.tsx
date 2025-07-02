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
      <div className="relative z-10 pt-72 md:pt-96" data-id="main-content-container">
        {/* Modern App-Style Header */}
        <div 
          className="relative -mt-5 z-10"
          data-id="floating-header-wrapper"
        >
          <div 
            className="bg-white md:mx-8 pt-8 pb-6 px-6"
            data-id="header-glassmorphism-card"
            style={{
              backgroundColor: '#ffffff',
              borderTopLeftRadius: '2rem',
              borderTopRightRadius: '2rem',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
            }}
          >
            {/* Speedy Wash+ Branding */}
            <div className="text-center" data-id="brand-section">
              {/* Main Brand Logo */}
              <div className="mb-6" data-id="brand-logo">
                <div className="flex items-start justify-center gap-1 mb-3">
                  <h1 
                    className="text-3xl sm:text-4xl font-bold uppercase tracking-tight italic"
                    style={{ 
                      color: '#0B2545',
                      letterSpacing: '-0.02em'
                    }}
                    data-id="speedy-text"
                  >
                    Speedy
                  </h1>
                  <h1 
                    className="text-3xl sm:text-4xl font-bold uppercase tracking-tight"
                    style={{ 
                      color: '#0B2545',
                      letterSpacing: '-0.02em'
                    }}
                    data-id="wash-text"
                  >
                    Wash
                  </h1>
                  <span 
                    className="text-lg sm:text-xl font-bold"
                    style={{ 
                      color: '#FFD60A',
                      marginTop: '-4px',
                      marginLeft: '2px'
                    }}
                    data-id="plus-symbol"
                  >
                    +
                  </span>
                </div>
              </div>
              
              {/* Call to Action Section */}
              <div data-id="cta-section">
                <div 
                  className="inline-block px-8 py-3 rounded-2xl mb-3 max-w-sm mx-auto"
                  style={{
                    background: 'linear-gradient(135deg, #0B2545 0%, #1463B4 100%)',
                    boxShadow: '0 4px 16px rgba(11, 37, 69, 0.15)',
                    width: '100%'
                  }}
                  data-id="main-cta-badge"
                >
                  <h2 
                    className="text-lg sm:text-xl font-bold text-white mb-1"
                    data-id="cta-title"
                  >
                    Select Your Unlimited Pass
                  </h2>
                  <p 
                    className="text-sm text-blue-100 opacity-90"
                    data-id="cta-subtitle"
                  >
                    Unlimited premium washes • Cancel anytime
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pure white content area for pricing */}
        <div 
          className={`${activePlan !== null ? 'pb-32' : 'pb-16'} transition-all duration-500`} 
          style={{ backgroundColor: '#ffffff' }} 
          data-id="pricing-content-area"
        >
          {/* Pricing selector container */}
          <div className="px-4 pb-8" style={{ backgroundColor: '#ffffff' }} data-id="pricing-selector-container">
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

