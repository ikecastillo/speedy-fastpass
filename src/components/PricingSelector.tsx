"use client";

import NumberFlow from '@number-flow/react'
import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { plans, calculatePrice, type Plan } from "@/types/plan";
import { plansMeta } from "@/lib/plans";

interface PricingSelectorProps {
  activePlan: number | null;
  setActivePlan: (index: number | null) => void;
  billingPeriod: number;
  setBillingPeriod: (period: number) => void;
}

export function PricingSelector({ activePlan, setActivePlan, billingPeriod, setBillingPeriod }: PricingSelectorProps) {
  const router = useRouter();

  const handleChangePlan = (index: number) => {
    setActivePlan(index);
  };

  const handleChangePeriod = (index: number) => {
    setBillingPeriod(index);
  };

  const handleGetStarted = () => {
    if (activePlan === null) return; // No plan selected
    
    const selectedPlan = plans[activePlan as number].name.toLowerCase().replace('+', '-plus');
    const period = billingPeriod === 0 ? 'monthly' : 'yearly';
    
    // Store plan data in localStorage to avoid search params issues
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedPlan', JSON.stringify({
        plan: selectedPlan,
        period: period,
        price: getPrice(plans[activePlan as number])
      }));
    }
    
    router.push('/checkout/vehicle');
  };

  const getPrice = (plan: Plan) => {
    const period = billingPeriod === 0 ? 'monthly' : 'yearly';
    return calculatePrice(plan, period);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      {/* Professional white container with subtle shadow */}
      <div className="rounded-3xl">
        
        {/* Billing Period Toggle - Keep unchanged but adjust margins */}
        <div className="rounded-full relative w-full max-w-md mx-auto p-1.5 flex items-center mb-6" style={{ backgroundColor: '#F5F7FA' }}>
          <button
            className="font-semibold rounded-full w-full p-1.5 z-20 relative text-sm"
            style={{ color: '#474D55' }}
            onClick={() => handleChangePeriod(0)}
          >
            Monthly
          </button>
          <button
            className="font-semibold rounded-full w-full p-1.5 z-20 relative text-sm"
            style={{ color: '#474D55' }}
            onClick={() => handleChangePeriod(1)}
          >
            Yearly
          </button>
          <div
            className={`p-1.5 flex items-center justify-center absolute inset-0 w-1/2 z-10 transition-transform duration-300 ${
              billingPeriod === 1 ? 'translate-x-full' : 'translate-x-0'
            }`}
          >
            <div className="bg-white shadow-sm rounded-full w-full h-full"></div>
          </div>
        </div>

        {/* Plans - 2x2 Grid Layout for all screen sizes */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
          {plans.map((plan, index) => {
            // Get corresponding planMeta for features display
            const planMeta = plansMeta.find(meta => 
              meta.label.toLowerCase().replace('+', '-plus') === plan.name.toLowerCase().replace('+', '-plus')
            );
            
            return (
              <motion.div
                key={plan.name}
                className={`relative overflow-hidden rounded-2xl sm:rounded-3xl border-2 cursor-pointer transition-all duration-300 ${
                  activePlan === index 
                    ? 'border-blue-500 bg-gradient-to-br from-blue-50/50 to-blue-100/30 shadow-xl shadow-blue-200/40 scale-105' 
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-lg shadow-sm hover:scale-102'
                }`}
                onClick={() => handleChangePlan(index)}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                {/* Popular badge overlay - Adjust size for mobile */}
                {plan.popular && (
                  <div className="absolute top-0 right-0 z-10">
                    <div 
                      className="px-2 py-1 sm:px-4 sm:py-2 text-white text-[10px] sm:text-xs font-bold rounded-bl-xl rounded-tr-2xl sm:rounded-bl-2xl sm:rounded-tr-3xl shadow-lg"
                      style={{
                        background: `linear-gradient(135deg, #1463B4, #12579C)`,
                      }}
                    >
                      Most Popular
                    </div>
                  </div>
                )}

                {/* Promo banner for special offers - Adjust size for mobile */}
                {(plan.name === 'Works+' || plan.name === 'Works') && (
                  <div className="absolute top-2 sm:top-4 left-2 sm:left-4 z-10">
                    <div className="bg-gradient-to-r from-red-500 to-red-600 text-white text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-lg border border-red-700/20">
                      $5 First Month!
                    </div>
                  </div>
                )}

                <div className="p-3 sm:p-6 h-full flex flex-col">
                  {/* Plan header */}
                  <div className="text-center mb-3 sm:mb-6">
                    <h3 className="font-bold text-lg sm:text-2xl text-gray-900 mb-1 sm:mb-2">
                      {plan.name}
                    </h3>
                    
                    {/* Price display - Adjust size for mobile */}
                    <div className="flex items-baseline justify-center gap-0.5 sm:gap-1 mb-1 sm:mb-2">
                      <span className="text-xl sm:text-2xl font-black text-gray-900">$</span>
                      <NumberFlow
                        className="text-2xl sm:text-4xl font-black text-gray-900"
                        value={getPrice(plan)}
                        format={{ minimumFractionDigits: 0, maximumFractionDigits: 0 }}
                      />
                      <span className="text-lg sm:text-xl font-semibold text-gray-600">
                        .
                        <NumberFlow
                          className="text-lg sm:text-xl font-semibold text-gray-600"
                          value={Math.round((getPrice(plan) % 1) * 100)}
                          format={{ minimumIntegerDigits: 2 }}
                        />
                      </span>
                      <span className="text-xs sm:text-sm font-medium text-gray-500 ml-0.5 sm:ml-1">
                        /{billingPeriod === 0 ? 'mo' : 'yr'}
                      </span>
                    </div>

                    {/* Crossed out price for special offers */}
                    {(plan.name === 'Works+' || plan.name === 'Works') && (
                      <div className="text-xs sm:text-sm text-gray-400 line-through">
                        Regular: $
                        <NumberFlow
                          className="text-xs sm:text-sm text-gray-400"
                          value={billingPeriod === 0 ? (plan.name === 'Works+' ? 39.99 : 34.99) : (plan.name === 'Works+' ? 399.99 : 349.99)}
                          format={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }}
                        />
                        /{billingPeriod === 0 ? 'mo' : 'yr'}
                      </div>
                    )}
                  </div>

                  {/* Plan features - Show fewer features on mobile */}
                  <div className="flex-grow mb-3 sm:mb-6">
                    <div className="space-y-2 sm:space-y-3">
                      {planMeta?.features?.filter(f => f.included).slice(0, 2).map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center gap-2 sm:gap-3">
                          <div className="w-4 h-4 sm:w-5 sm:h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <svg className="w-2 h-2 sm:w-3 sm:h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <span className="text-xs sm:text-sm font-medium text-gray-700 line-clamp-1">
                            {feature.name}
                          </span>
                        </div>
                      ))}
                      {planMeta?.features && planMeta.features.filter(f => f.included).length > 2 && (
                        <div className="text-[10px] sm:text-xs text-gray-500 font-medium">
                          +{planMeta.features.filter(f => f.included).length - 2} more features
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Selection indicator - Adjust size for mobile */}
                  <div className="flex justify-center">
                    <div
                      className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                        activePlan === index 
                          ? 'border-blue-500 bg-blue-500 shadow-lg shadow-blue-200/50' 
                          : 'border-gray-300 bg-white'
                      }`}
                    >
                      {activePlan === index && (
                        <motion.div
                          className="w-3 h-3 sm:w-4 sm:h-4 bg-white rounded-full"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.2 }}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Enhanced Get Started Button */}
        <motion.button 
          className={`w-full max-w-md mx-auto block rounded-xl sm:rounded-2xl text-base sm:text-lg font-bold py-3 sm:py-4 px-4 sm:px-6 transition-all duration-300 shadow-lg ${
            activePlan !== null 
              ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-blue-200/50 hover:from-blue-700 hover:to-blue-800 hover:shadow-xl hover:shadow-blue-200/60' 
              : 'bg-gray-200 text-gray-500 cursor-not-allowed shadow-gray-200/30'
          }`}
          whileTap={activePlan !== null ? { scale: 0.98 } : {}}
          whileHover={activePlan !== null ? { y: -1 } : {}}
          onClick={handleGetStarted}
          disabled={activePlan === null}
        >
          {activePlan !== null ? (
            <span className="flex items-center justify-center gap-2">
              Get Started
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          ) : (
            'Select a plan to continue'
          )}
        </motion.button>

        {/* Enhanced footer with location and trust indicators */}
        <div className="text-center mt-4 sm:mt-6 space-y-1">
          <p className="text-[10px] sm:text-xs text-gray-500">
            Cancel anytime • No setup fees • 30-day guarantee
          </p>
          <div className="flex items-center justify-center gap-1 text-[10px] sm:text-xs text-gray-400">
            <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <span>Serving Round Rock, Texas and surrounding areas</span>
          </div>
        </div>
      </div>
    </div>
  );
} 