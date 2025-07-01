"use client";

import NumberFlow from '@number-flow/react'
import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { plans, calculatePrice, type Plan } from "@/types/plan";

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
    <div className="bg-white py-8 px-4">
      <div className="w-full max-w-md mx-auto">
        {/* Professional white container with subtle shadow */}
        <div className="bg-white rounded-3xl p-6 shadow-xl shadow-gray-200/40 border border-gray-100/50">
          
          {/* Billing Period Toggle - Keep unchanged */}
          <div className="rounded-full relative w-full p-1.5 flex items-center mb-6" style={{ backgroundColor: '#F5F7FA' }}>
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

          {/* Plans - Redesigned for elegance */}
          <div className="space-y-3 mb-6">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                className={`relative overflow-hidden rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                  activePlan === index 
                    ? 'border-blue-500 bg-blue-50/30 shadow-lg shadow-blue-200/30' 
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md shadow-sm'
                }`}
                onClick={() => handleChangePlan(index)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                {/* Popular badge overlay */}
                {plan.popular && (
                  <div className="absolute top-0 right-0">
                    <div 
                      className="px-3 py-1 text-white text-xs font-bold rounded-bl-xl rounded-tr-2xl shadow-md"
                      style={{
                        background: `linear-gradient(135deg, #1463B4, #12579C)`,
                      }}
                    >
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="p-4 flex items-center justify-between">
                  <div className="flex-1">
                    {/* Plan name and title */}
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-xl text-gray-900">
                        {plan.name}
                      </h3>
                      {(plan.name === 'Works+' || plan.name === 'Works') && (
                        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                          $5 First Month!
                        </div>
                      )}
                    </div>
                    
                    {/* Price display */}
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-gray-900">$</span>
                      <NumberFlow
                        className="text-3xl font-black text-gray-900"
                        value={getPrice(plan)}
                        format={{ minimumFractionDigits: 0, maximumFractionDigits: 0 }}
                      />
                      <span className="text-lg font-semibold text-gray-600">
                        .
                        <NumberFlow
                          className="text-lg font-semibold text-gray-600"
                          value={Math.round((getPrice(plan) % 1) * 100)}
                          format={{ minimumIntegerDigits: 2 }}
                        />
                      </span>
                      <span className="text-sm font-medium text-gray-500 ml-1">
                        /{billingPeriod === 0 ? 'mo' : 'yr'}
                      </span>
                    </div>

                    {/* Crossed out price for special offers */}
                    {(plan.name === 'Works+' || plan.name === 'Works') && (
                      <div className="text-sm text-gray-400 line-through mt-1">
                        Regular: $
                        <NumberFlow
                          className="text-sm text-gray-400"
                          value={billingPeriod === 0 ? (plan.name === 'Works+' ? 39.99 : 34.99) : (plan.name === 'Works+' ? 399.99 : 349.99)}
                          format={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }}
                        />
                        /{billingPeriod === 0 ? 'mo' : 'yr'}
                      </div>
                    )}
                  </div>

                  {/* Enhanced radio button */}
                  <div className="ml-4">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                        activePlan === index 
                          ? 'border-blue-500 bg-blue-500 shadow-lg shadow-blue-200/50' 
                          : 'border-gray-300 bg-white'
                      }`}
                    >
                      {activePlan === index && (
                        <motion.div
                          className="w-3 h-3 bg-white rounded-full"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.2 }}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Enhanced Get Started Button */}
          <motion.button 
            className={`w-full rounded-2xl text-lg font-bold py-4 px-6 transition-all duration-300 shadow-lg ${
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
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            ) : (
              'Select a plan to continue'
            )}
          </motion.button>

          {/* Subtle footer text */}
          <p className="text-center text-xs text-gray-500 mt-4">
            Cancel anytime • No setup fees • 30-day guarantee
          </p>
        </div>
      </div>
    </div>
  );
} 