"use client";

import { PlanDetailsCard } from "@/components/PlanDetailsCard";
import { PricingSelector } from "@/components/PricingSelector";
import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function HomePage() {
  const [activePlan, setActivePlan] = useState<number | null>(null);
  const [billingPeriod, setBillingPeriod] = useState(0); // 0 = Monthly, 1 = Yearly
  
  return (
    <div className="relative">
      {/* Fixed Hero Background */}
      <div className="fixed top-0 left-0 w-full h-screen z-0">
        <PlanDetailsCard 
          selectedPlanIndex={activePlan} 
          billingPeriod={billingPeriod === 0 ? 'monthly' : 'yearly'} 
        />
      </div>

      {/* Spacer to allow scroll */}
      <div className="h-screen"></div>

      {/* Sliding Content that overlays the fixed hero */}
      <div className="relative z-10 min-h-screen">
        <div 
          className="mx-4 md:mx-8"
          style={{
            // Sophisticated shadow system
            boxShadow: `
              0 -25px 50px -15px rgba(11, 37, 69, 0.25),
              0 -15px 30px -10px rgba(11, 37, 69, 0.15),
              0 -8px 15px -5px rgba(11, 37, 69, 0.1),
              0 -3px 8px -2px rgba(11, 37, 69, 0.05)
            `
          }}
        >
          <div className="bg-white rounded-t-3xl overflow-hidden">
            {/* Brand Header */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="px-6 py-8 text-center bg-gradient-to-b from-white to-gray-50/50"
            >
              {/* Speedy Wash+ Branding */}
              <div className="mb-6">
                <div className="flex items-start justify-center mb-4">
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold uppercase tracking-wider" style={{ color: '#2F343A' }}>
                    Speedy Wash
                    <span 
                      className="text-xl md:text-2xl lg:text-3xl font-bold ml-1"
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
              </div>
              
              {/* Animated Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <h2 
                  className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 bg-clip-text text-transparent"
                  style={{
                    background: `linear-gradient(45deg, #0B2545, #1463B4)`,
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text'
                  }}
                >
                  Get Your Fast Pass
                </h2>
                <p className="text-lg md:text-xl mb-4 max-w-2xl mx-auto font-medium" style={{ color: '#474D55' }}>
                  Unlock unlimited premium washes with your monthly membership
                </p>
                <div className="space-y-3">
                  <div className="text-base md:text-lg font-medium" style={{ color: '#6F7780' }}>
                    🚗 Drive up, flash your pass, drive clean
                  </div>
                  <motion.div 
                    className="text-sm md:text-base font-semibold tracking-wide uppercase py-3 px-6 rounded-full inline-block"
                    style={{ 
                      color: '#0B2545',
                      backgroundColor: '#F5F7FA',
                      border: '2px solid rgba(11, 37, 69, 0.1)'
                    }}
                    whileHover={{ 
                      scale: 1.05,
                      backgroundColor: '#FFD60A',
                      color: '#0B2545'
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    Select your membership below to get started
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>

            {/* Pricing Selector with Enhanced Spacing */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="px-4 py-8 bg-white"
            >
              <div className="flex items-center justify-center">
                <PricingSelector 
                  activePlan={activePlan}
                  setActivePlan={setActivePlan}
                  billingPeriod={billingPeriod}
                  setBillingPeriod={setBillingPeriod}
                />
              </div>
            </motion.div>

            {/* Additional content to demonstrate the effect */}
            <div className="px-6 py-16 bg-white">
              <div className="max-w-4xl mx-auto text-center">
                <h3 className="text-2xl font-bold mb-4" style={{ color: '#2F343A' }}>
                  Premium Car Care Experience
                </h3>
                <p className="text-lg mb-8" style={{ color: '#6F7780' }}>
                  Experience the difference with our state-of-the-art facility and professional-grade equipment.
                </p>
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: '#F5F7FA' }}>
                      <span className="text-2xl">🚗</span>
                    </div>
                    <h4 className="font-bold mb-2" style={{ color: '#2F343A' }}>Drive-Through Convenience</h4>
                    <p className="text-sm" style={{ color: '#6F7780' }}>Quick and easy access without leaving your vehicle</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: '#F5F7FA' }}>
                      <span className="text-2xl">⚡</span>
                    </div>
                    <h4 className="font-bold mb-2" style={{ color: '#2F343A' }}>Lightning Fast</h4>
                    <p className="text-sm" style={{ color: '#6F7780' }}>Get your car cleaned in minutes, not hours</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: '#F5F7FA' }}>
                      <span className="text-2xl">✨</span>
                    </div>
                    <h4 className="font-bold mb-2" style={{ color: '#2F343A' }}>Premium Results</h4>
                    <p className="text-sm" style={{ color: '#6F7780' }}>Professional-grade equipment for showroom shine</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
