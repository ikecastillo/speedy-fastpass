"use client";

import NumberFlow from '@number-flow/react'
import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { plans, calculatePrice, type Plan } from "@/types/plan";

export function PricingSelector() {
  const router = useRouter();
  const [activePlan, setActivePlan] = React.useState(1); // Default to Deluxe (Popular)
  const [billingPeriod, setBillingPeriod] = React.useState(0); // 0 = Monthly, 1 = Yearly

  const handleChangePlan = (index: number) => {
    setActivePlan(index);
  };

  const handleChangePeriod = (index: number) => {
    setBillingPeriod(index);
  };

  const handleGetStarted = () => {
    const selectedPlan = plans[activePlan].name.toLowerCase().replace('+', '-plus');
    const period = billingPeriod === 0 ? 'monthly' : 'yearly';
    
    // Store plan data in localStorage to avoid search params issues
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedPlan', JSON.stringify({
        plan: selectedPlan,
        period: period,
        price: getPrice(plans[activePlan])
      }));
    }
    
    router.push('/checkout/vehicle');
  };

  const handleAutoDemo = () => {
    // Auto-select Deluxe plan (index 1) with yearly billing for best savings
    setActivePlan(1); // Deluxe plan
    setBillingPeriod(1); // Yearly
    
    // Small delay to show the selection animation, then proceed
    setTimeout(() => {
      const selectedPlan = plans[1].name.toLowerCase().replace('+', '-plus');
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('selectedPlan', JSON.stringify({
          plan: selectedPlan,
          period: 'yearly',
          price: getPrice(plans[1])
        }));
      }
      
      router.push('/checkout/vehicle');
    }, 800); // 800ms to show the selection animation
  };

  const getPrice = (plan: Plan) => {
    const period = billingPeriod === 0 ? 'monthly' : 'yearly';
    return calculatePrice(plan, period);
  };

  // const formatPrice = (price: number) => {
  //   return price.toFixed(2);
  // };

  return (
    <div className="border-2 border-brand rounded-[32px] p-3 shadow-md max-w-sm w-full flex flex-col items-center gap-2 bg-white">
      {/* Billing Period Toggle */}
      <div className="rounded-full relative w-full bg-slate-100 p-1.5 flex items-center">
        <button
          className="font-semibold rounded-full w-full p-1.5 text-slate-800 z-20"
          onClick={() => handleChangePeriod(0)}
        >
          Monthly
        </button>
        <button
          className="font-semibold rounded-full w-full p-1.5 text-slate-800 z-20"
          onClick={() => handleChangePeriod(1)}
        >
          Yearly
        </button>
        <motion.div
          className="p-1.5 flex items-center justify-center absolute inset-0 w-1/2 z-10"
          animate={{
            transform: `translateX(${billingPeriod * 100}%)`,
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-white shadow-sm rounded-full w-full h-full"></div>
        </motion.div>
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
              <p className="font-semibold text-lg md:text-xl flex items-center gap-2 text-gray-950">
                {plan.name}
                {plan.popular && (
                  <span className="py-1 px-2 block rounded-lg bg-accent text-black text-sm font-medium">
                    Popular
                  </span>
                )}
              </p>
              <p className="text-slate-500 text-sm md:text-md flex">
                <span className="text-black font-medium flex items-center">
                  $
                  <NumberFlow
                    className="text-black font-medium"
                    value={getPrice(plan)}
                    format={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }}
                  />
                </span>
                /{billingPeriod === 0 ? 'month' : 'year'}
              </p>
            </div>
            <div
              className="border-2 size-6 rounded-full mt-0.5 p-1 flex items-center justify-center transition-colors duration-300"
              style={{
                borderColor: activePlan === index ? "#1e40af" : "#64748b",
              }}
            >
              <motion.div
                className="size-3 rounded-full"
                style={{
                  backgroundColor: "#1e40af",
                }}
                animate={{
                  opacity: activePlan === index ? 1 : 0,
                }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        ))}
        
        {/* Animated Selection Border */}
        <motion.div
          className="w-full h-[82px] absolute top-0 border-[3px] border-brand rounded-2xl pointer-events-none"
          animate={{
            transform: `translateY(${activePlan * 82 + 8 * activePlan}px)`,
          }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Get Started Button */}
      <motion.button 
        className="rounded-full bg-brand text-base md:text-lg text-white w-full p-2.5 md:p-3 transition-transform duration-300"
        whileTap={{ scale: 0.95 }}
        onClick={handleGetStarted}
      >
        Get Started
      </motion.button>

      {/* Auto Demo Button */}
      <motion.button 
        className="rounded-full bg-accent text-base md:text-lg text-gray-800 w-full p-2.5 md:p-3 transition-transform duration-300 border-2 border-yellow-600 font-semibold"
        whileTap={{ scale: 0.95 }}
        onClick={handleAutoDemo}
      >
        🎯 Auto-Demo (Deluxe + Yearly)
      </motion.button>
    </div>
  );
} 