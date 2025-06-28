"use client";

import NumberFlow from '@number-flow/react'
import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { plans, calculatePrice, type Plan } from "@/types/plan";
import { PlanDetailsCard } from "./PlanDetailsCard";

export function PricingSelector() {
  const router = useRouter();
  const [activePlan, setActivePlan] = React.useState<number | null>(null); // No plan selected initially
  const [billingPeriod, setBillingPeriod] = React.useState(0); // 0 = Monthly, 1 = Yearly
  const [mounted, setMounted] = React.useState(false);

  // Prevent hydration mismatch by only showing animations after mount
  React.useEffect(() => {
    setMounted(true);
  }, []);
  
  // Calculate precise animation values based on actual rendered dimensions
  const getAnimationValues = React.useCallback(() => {
    // CORRECTED: Based on user observation, actual dimensions are:
    // Each plan item appears to be ~77px tall (not 76px)
    // Gap between items: 8px (gap-2)
    // Total offset per item: 85px
    // 
    // This gives us the correct positions:
    // • Deluxe (index 1): 1 × 85 = 85px (observed: 86px) ✅
    // • Works (index 2): 2 × 85 = 170px (observed: 170px) ✅  
    // • Works+ (index 3): 3 × 85 = 255px (observed: 256px) ✅
    
    const itemHeight = 77; // Corrected from 76px
    const gap = 8;
    const totalOffset = itemHeight + gap; // 77 + 8 = 85px total
    
    return {
      itemHeight,
      translateY: activePlan !== null ? activePlan * totalOffset : 0,
    };
  }, [activePlan]);

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
    <div className="rounded-[32px] p-3 shadow-md w-full md:max-w-sm flex flex-col items-center gap-2 bg-white">
      {/* Dynamic Plan Details Card */}
      <PlanDetailsCard 
        selectedPlanIndex={activePlan} 
        billingPeriod={billingPeriod === 0 ? 'monthly' : 'yearly'} 
      />

      {/* Billing Period Toggle */}
      <div className="rounded-full relative w-full bg-slate-100 p-1.5 flex items-center">
        <button
          className="font-semibold rounded-full w-full p-1.5 text-slate-800 z-20 relative"
          onClick={() => handleChangePeriod(0)}
        >
          Monthly
        </button>
        <button
          className="font-semibold rounded-full w-full p-1.5 text-slate-800 z-20 relative"
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
            className="w-full flex justify-between cursor-pointer border-2 border-gray-400 p-3 rounded-2xl"
            onClick={() => handleChangePlan(index)}
          >
            <div className="flex flex-col items-start">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-semibold text-lg md:text-xl text-gray-950">
                  {plan.name}
                </p>
                {plan.popular && (
                  <span className="px-2 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-bold rounded-full shadow-lg border border-blue-700">
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
                activePlan === index ? 'border-brand' : 'border-gray-500'
              }`}
            >
              <div
                className={`size-3 rounded-full transition-all duration-300 ${
                  activePlan === index ? 'bg-brand opacity-100' : 'bg-transparent opacity-0'
                }`}
              />
            </div>
          </div>
        ))}
        
        {/* Animated Selection Border - Only show after hydration and when a plan is selected */}
        {mounted && activePlan !== null && (
          <motion.div
            className="w-full absolute top-0 border-[3px] border-brand rounded-2xl pointer-events-none"
            initial={{
              transform: `translateY(${getAnimationValues().translateY}px)`,
              height: `${getAnimationValues().itemHeight}px`,
            }}
            animate={{
              transform: `translateY(${getAnimationValues().translateY}px)`,
              height: `${getAnimationValues().itemHeight}px`,
            }}
            transition={{ duration: 0.3 }}
          />
        )}
      </div>

      {/* Get Started Button */}
      <motion.button 
        className={`rounded-full text-base md:text-lg w-full p-2.5 md:p-3 transition-all duration-300 ${
          activePlan !== null 
            ? 'bg-brand text-white hover:bg-brand/90 cursor-pointer' 
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
        whileTap={activePlan !== null ? { scale: 0.95 } : {}}
        onClick={handleGetStarted}
        disabled={activePlan === null}
      >
        {activePlan !== null ? 'Get Started' : 'Select a plan to continue'}
      </motion.button>


    </div>
  );
} 