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

  // const formatPrice = (price: number) => {
  //   return price.toFixed(2);
  // };

  return (
    <div className="w-full md:max-w-sm flex flex-col items-center gap-2 bg-white rounded-[32px] p-3 shadow-md">
      {/* Billing Period Toggle */}
      <div className="rounded-full relative w-full p-1.5 flex items-center" style={{ backgroundColor: '#F5F7FA' }}>
        <button
          className="font-semibold rounded-full w-full p-1.5 z-20 relative"
          style={{ color: '#474D55' }}
          onClick={() => handleChangePeriod(0)}
        >
          Monthly
        </button>
        <button
          className="font-semibold rounded-full w-full p-1.5 z-20 relative"
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

      {/* Plans */}
      <div className="w-full relative flex flex-col items-center justify-center gap-2">
        {plans.map((plan, index) => (
          <div
            key={plan.name}
            className={`w-full flex justify-between cursor-pointer p-3 rounded-2xl transition-all duration-300 ${
              activePlan === index 
                ? 'bg-white shadow-lg shadow-blue-200/50 scale-[1.02]' 
                : 'bg-white shadow-md shadow-gray-200/30 hover:shadow-lg hover:shadow-gray-200/50'
            }`}
            onClick={() => handleChangePlan(index)}
          >
            <div className="flex flex-col items-start">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-semibold text-lg md:text-xl text-gray-950">
                  {plan.name}
                </p>
                {plan.popular && (
                  <span 
                    className="px-2 py-1 text-white text-xs font-bold rounded-full shadow-lg border"
                    style={{
                      background: `linear-gradient(45deg, #1463B4, #12579C)`,
                      borderColor: '#0E4377'
                    }}
                  >
                    Most Popular
                  </span>
                )}
              </div>
              
              {/* Price with optional special offer */}
              <div className="flex items-center gap-2 h-6"> {/* Fixed height container */}
                <p className={`text-slate-500 text-sm md:text-md flex ${(plan.name === 'Works' || plan.name === 'Works+') ? 'relative' : ''}`}>
                  <span className={`text-black font-medium flex items-center ${(plan.name === 'Works' || plan.name === 'Works+') ? 'line-through text-gray-400' : ''}`}>
                    $
                    <NumberFlow
                      className={`font-medium ${(plan.name === 'Works' || plan.name === 'Works+') ? 'text-gray-400' : 'text-black'}`}
                      value={getPrice(plan)}
                      format={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }}
                    />
                  </span>
                  /{billingPeriod === 0 ? 'month' : 'year'}
                  
                  {/* Red strikethrough line for special offers */}
                  {(plan.name === 'Works' || plan.name === 'Works+') && (
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full h-0.5 bg-red-500"></div>
                    </div>
                  )}
                </p>
                
                {/* Special Offer Badge - Fixed height, doesn't affect layout */}
                {(plan.name === 'Works' || plan.name === 'Works+') && (
                  <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg border border-red-600 whitespace-nowrap">
                    $5 First Month!
                  </div>
                )}
              </div>
            </div>
            <div
              className={`border-2 size-6 rounded-full mt-0.5 p-1 flex items-center justify-center transition-all duration-300 ${
                activePlan === index ? 'border-gray-500' : 'border-gray-400'
              }`}
              style={{
                borderColor: activePlan === index ? '#1463B4' : '#9EA5AD'
              }}
            >
              <div
                className={`size-3 rounded-full transition-all duration-300 ${
                  activePlan === index ? 'opacity-100' : 'bg-transparent opacity-0'
                }`}
                style={{
                  backgroundColor: activePlan === index ? '#1463B4' : 'transparent'
                }}
              />
            </div>
          </div>
        ))}

      </div>

      {/* Get Started Button */}
      <motion.button 
        className={`rounded-full text-base md:text-lg w-full p-2.5 md:p-3 transition-all duration-300 ${
          activePlan !== null 
            ? 'text-white cursor-pointer' 
            : 'cursor-not-allowed'
        }`}
        style={{
          backgroundColor: activePlan !== null ? '#1463B4' : '#C8CDD2',
          color: activePlan !== null ? 'white' : '#6F7780'
        }}
        whileTap={activePlan !== null ? { scale: 0.95 } : {}}
        onMouseEnter={(e) => {
          if (activePlan !== null) {
            e.currentTarget.style.backgroundColor = '#12579C';
          }
        }}
        onMouseLeave={(e) => {
          if (activePlan !== null) {
            e.currentTarget.style.backgroundColor = '#1463B4';
          }
        }}
        onClick={handleGetStarted}
        disabled={activePlan === null}
      >
        {activePlan !== null ? 'Get Started' : 'Select a plan to continue'}
      </motion.button>


    </div>
  );
} 