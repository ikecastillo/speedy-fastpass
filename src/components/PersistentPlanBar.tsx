"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { plans, calculatePrice, type Plan } from "@/types/plan";
import { plansMeta } from "@/lib/plans";

interface PersistentPlanBarProps {
  activePlan: number | null;
  billingPeriod: number;
  onContinue?: () => void;
  showContinueButton?: boolean;
  continueText?: string;
  currentStep?: 'pricing' | 'vehicle' | 'payment';
}

export function PersistentPlanBar({ 
  activePlan, 
  billingPeriod, 
  onContinue,
  showContinueButton = true,
  continueText = "Get Started",
  currentStep = 'pricing'
}: PersistentPlanBarProps) {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);

  if (activePlan === null) return null;

  const selectedPlan = plans[activePlan];
  const planMeta = plansMeta.find(meta => 
    meta.label.toLowerCase().replace('+', '-plus') === selectedPlan.name.toLowerCase().replace('+', '-plus')
  );

  const getPrice = (plan: Plan) => {
    const period = billingPeriod === 0 ? 'monthly' : 'yearly';
    return calculatePrice(plan, period);
  };

  const handleContinue = () => {
    if (onContinue) {
      onContinue();
    } else {
      const selectedPlanName = selectedPlan.name.toLowerCase().replace('+', '-plus');
      const period = billingPeriod === 0 ? 'monthly' : 'yearly';
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('selectedPlan', JSON.stringify({
          plan: selectedPlanName,
          period: period,
          price: getPrice(selectedPlan)
        }));
      }
      
      router.push('/checkout/vehicle');
    }
  };

  const isWorksPlus = selectedPlan.name === 'Works+';

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="fixed bottom-0 left-0 right-0 z-50"
    >
      {/* Background overlay with blur */}
      <div className="absolute inset-0 bg-white/95 backdrop-blur-xl border-t border-gray-200 shadow-2xl" />
      
      {/* Content */}
      <div className="relative px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-4xl mx-auto">
          {/* Main bar content */}
          <div className="flex items-center justify-between gap-4">
            {/* Left: Plan info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3">
                {/* Plan icon/indicator */}
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                  isWorksPlus 
                    ? 'bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700' 
                    : 'bg-gradient-to-br from-blue-500 to-blue-600'
                }`}>
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>

                {/* Plan details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-lg text-gray-900 truncate">
                      {selectedPlan.name}
                    </h3>
                    <span className="text-sm font-medium text-gray-500">
                      {billingPeriod === 0 ? 'Monthly' : 'Yearly'}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-black text-gray-900">
                        ${Math.floor(getPrice(selectedPlan))}.{String(Math.round((getPrice(selectedPlan) % 1) * 100)).padStart(2, '0')}
                      </span>
                      <span className="text-sm font-medium text-gray-500">
                        /{billingPeriod === 0 ? 'mo' : 'yr'}
                      </span>
                    </div>
                    
                    {/* Features preview */}
                    <button
                      onClick={() => setIsExpanded(!isExpanded)}
                      className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      <span className="hidden sm:inline">Show All Features</span>
                      <span className="sm:hidden">Features</span>
                      <svg 
                        className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: CTA Button */}
            {showContinueButton && (
              <motion.button
                onClick={handleContinue}
                className={`px-6 py-3 rounded-xl font-bold text-white transition-all duration-300 shadow-lg flex items-center gap-2 ${
                  isWorksPlus
                    ? 'bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 hover:from-blue-700 hover:via-blue-800 hover:to-purple-800 shadow-blue-200/50 hover:shadow-blue-300/60'
                    : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-blue-200/50 hover:shadow-blue-200/60'
                }`}
                whileTap={{ scale: 0.98 }}
                whileHover={{ y: -1 }}
              >
                <span className="hidden sm:inline">{continueText}</span>
                <span className="sm:hidden">
                  {currentStep === 'pricing' ? 'Start' : currentStep === 'vehicle' ? 'Next' : 'Pay'}
                </span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </motion.button>
            )}
          </div>

          {/* Expandable features */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden mt-4"
              >
                <div className="border-t border-gray-100 pt-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">All Features:</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                    {planMeta?.features?.map((feature, featureIndex) => (
                      <div key={featureIndex} className={`flex items-center gap-2 text-xs ${
                        feature.included ? 'text-gray-700' : 'text-gray-400'
                      }`}>
                        <div className={`w-3 h-3 rounded flex items-center justify-center flex-shrink-0 ${
                          feature.included ? 'bg-green-500' : 'bg-gray-300'
                        }`}>
                          {feature.included ? (
                            <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        <span className={`truncate ${feature.included ? '' : 'line-through'}`}>
                          {feature.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
} 