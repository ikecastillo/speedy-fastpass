"use client";

import NumberFlow from '@number-flow/react'
import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface Plan {
  name: string;
  monthlyPrice: number;
  popular?: boolean;
}

const plans: Plan[] = [
  { name: "Basic", monthlyPrice: 19.99 },
  { name: "Deluxe", monthlyPrice: 24.99, popular: true },
  { name: "Works", monthlyPrice: 34.99 },
  { name: "Works+", monthlyPrice: 39.99 },
];

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
    router.push(`/checkout/vehicle?plan=${selectedPlan}&period=${period}`);
  };

  const getPrice = (plan: Plan) => {
    if (billingPeriod === 0) {
      return plan.monthlyPrice;
    } else {
      return plan.monthlyPrice * 10; // Yearly = monthly × 10
    }
  };

  // const formatPrice = (price: number) => {
  //   return price.toFixed(2);
  // };

  return (
    <div className="border-2 border-brand rounded-[32px] p-3 shadow-md max-w-sm w-full flex flex-col items-center gap-3 bg-white">
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
      <div className="w-full relative flex flex-col items-center justify-center gap-3">
        {plans.map((plan, index) => (
          <div
            key={plan.name}
            className="w-full flex justify-between cursor-pointer border-2 border-gray-400 p-4 rounded-2xl"
            onClick={() => handleChangePlan(index)}
          >
            <div className="flex flex-col items-start">
              <p className="font-semibold text-xl flex items-center gap-2 text-gray-950">
                {plan.name}
                {plan.popular && (
                  <span className="py-1 px-2 block rounded-lg bg-accent text-black text-sm font-medium">
                    Popular
                  </span>
                )}
              </p>
              <p className="text-slate-500 text-md flex">
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
                borderColor: activePlan === index ? "#0050FF" : "#64748b",
              }}
            >
              <motion.div
                className="size-3 rounded-full"
                style={{
                  backgroundColor: "#0050FF",
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
          className="w-full h-[88px] absolute top-0 border-[3px] border-brand rounded-2xl pointer-events-none"
          animate={{
            transform: `translateY(${activePlan * 88 + 12 * activePlan}px)`,
          }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Get Started Button */}
      <motion.button 
        className="rounded-full bg-brand text-lg text-white w-full p-3 transition-transform duration-300"
        whileTap={{ scale: 0.95 }}
        onClick={handleGetStarted}
      >
        Get Started
      </motion.button>
    </div>
  );
} 