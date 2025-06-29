"use client";

import { PlanDetailsCard } from "@/components/PlanDetailsCard";
import { PricingSelector } from "@/components/PricingSelector";
import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function HomePage() {
  const [activePlan, setActivePlan] = useState<number | null>(null);
  const [billingPeriod, setBillingPeriod] = useState(0); // 0 = Monthly, 1 = Yearly
  
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Parallax transforms
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  return (
    <div ref={containerRef} className="min-h-screen bg-gray-50">
      {/* Hero Section with Parallax */}
      <motion.div 
        style={{ y: heroY }}
        className="relative"
      >
        <PlanDetailsCard 
          selectedPlanIndex={activePlan} 
          billingPeriod={billingPeriod === 0 ? 'monthly' : 'yearly'} 
        />
      </motion.div>

      {/* Overlapping Content Section with Modern Shadow */}
      <motion.div
        style={{ 
          y: contentY,
          opacity: overlayOpacity
        }}
        className="relative -mt-20 md:-mt-32 lg:-mt-40 z-20"
      >
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
            {/* Brand Header with Parallax */}
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
          </div>
        </div>
      </motion.div>

      {/* Additional spacing for scroll effect */}
      <div className="h-32"></div>
    </div>
  );
}
