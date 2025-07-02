"use client";

import NumberFlow from '@number-flow/react'
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  const [expandedPlan, setExpandedPlan] = useState<number | null>(null);

  // Auto-expand details when a plan is selected
  useEffect(() => {
    if (activePlan !== null) {
      setExpandedPlan(activePlan);
    }
  }, [activePlan]);

  const handleChangePlan = (index: number) => {
    setActivePlan(index);
    // Auto-expand details when plan is selected
    setExpandedPlan(index);
  };

  const handleChangePeriod = (index: number) => {
    setBillingPeriod(index);
  };

  const handleGetStarted = () => {
    if (activePlan === null) return;
    
    const selectedPlan = plans[activePlan as number].name.toLowerCase().replace('+', '-plus');
    const period = billingPeriod === 0 ? 'monthly' : 'yearly';
    
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
      <div className="rounded-3xl">
        
        {/* Modern App-Style Header */}
        <div 
          className="relative -mt-8 mb-6 mx-4 sm:mx-8 pt-8 pb-6 px-6"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.98) 100%)',
            borderTopLeftRadius: '2rem',
            borderTopRightRadius: '2rem',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            boxShadow: '0 -8px 32px rgba(0,0,0,0.08), 0 -4px 16px rgba(0,0,0,0.04)',
          }}
        >
          {/* Speedy Wash+ Branding */}
          <div className="text-center mb-4">
            <div className="flex items-start justify-center mb-2">
              <h1 className="text-2xl sm:text-3xl font-bold uppercase tracking-wider" style={{ color: '#0B2545' }}>
                Speedy Wash
                <span 
                  className="text-lg sm:text-xl font-bold ml-1"
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
            
            {/* Location with icon */}
            <div className="flex items-center justify-center gap-1.5 text-sm font-medium mb-3" style={{ color: '#6F7780' }}>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <span>Round Rock, Texas</span>
            </div>
            
            {/* Tagline */}
            <div>
              <h2 
                className="text-lg sm:text-xl font-bold mb-2"
                style={{ color: '#0B2545' }}
              >
                Select Your Unlimited Pass
              </h2>
              <p className="text-sm text-gray-600 max-w-sm mx-auto">
                Get unlimited premium washes with your monthly membership
              </p>
            </div>
          </div>
        </div>

        {/* Billing Period Toggle */}
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

        {/* Desktop: 2x2 Grid */}
        <div className="hidden sm:grid sm:grid-cols-2 gap-4 mb-8">
          {plans.map((plan, index) => {
            const planMeta = plansMeta.find(meta => 
              meta.label.toLowerCase().replace('+', '-plus') === plan.name.toLowerCase().replace('+', '-plus')
            );
            
            return (
              <div
                key={plan.name}
                className={`relative overflow-hidden rounded-3xl border-2 cursor-pointer transition-all duration-300 ${
                  activePlan === index 
                    ? 'border-blue-500 bg-gradient-to-br from-blue-50/50 to-blue-100/30 shadow-xl shadow-blue-200/40 scale-105' 
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-lg shadow-sm hover:scale-102'
                }`}
                onClick={() => handleChangePlan(index)}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 z-10">
                    <div 
                      className="px-4 py-2 text-white text-xs font-bold rounded-bl-2xl rounded-tr-3xl shadow-lg"
                      style={{ background: `linear-gradient(135deg, #1463B4, #12579C)` }}
                    >
                      Most Popular
                    </div>
                  </div>
                )}

                {(plan.name === 'Works+' || plan.name === 'Works') && (
                  <div className="absolute top-4 left-4 z-10">
                    <div className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg border border-red-700/20">
                      $5 First Month!
                    </div>
                  </div>
                )}

                <div className="p-6 h-full flex flex-col">
                  <div className="text-center mb-6">
                    <h3 className="font-bold text-2xl text-gray-900 mb-2">
                      {plan.name}
                    </h3>
                    
                    <div className="flex items-baseline justify-center gap-1 mb-2">
                      <span className="text-2xl font-black text-gray-900">$</span>
                      <NumberFlow
                        className="text-4xl font-black text-gray-900"
                        value={getPrice(plan)}
                        format={{ minimumFractionDigits: 0, maximumFractionDigits: 0 }}
                      />
                      <span className="text-xl font-semibold text-gray-600">
                        .
                        <NumberFlow
                          className="text-xl font-semibold text-gray-600"
                          value={Math.round((getPrice(plan) % 1) * 100)}
                          format={{ minimumIntegerDigits: 2 }}
                        />
                      </span>
                      <span className="text-sm font-medium text-gray-500 ml-1">
                        /{billingPeriod === 0 ? 'mo' : 'yr'}
                      </span>
                    </div>

                    {(plan.name === 'Works+' || plan.name === 'Works') && (
                      <div className="text-sm text-gray-400 line-through">
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

                  <div className="flex-grow mb-6">
                    <div className="space-y-3">
                      {planMeta?.features?.filter(f => f.included).slice(0, 3).map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center gap-3">
                          <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <span className="text-sm font-medium text-gray-700">
                            {feature.name}
                          </span>
                        </div>
                      ))}
                      {planMeta?.features && planMeta.features.filter(f => f.included).length > 3 && (
                        <div className="text-xs text-gray-500 font-medium">
                          +{planMeta.features.filter(f => f.included).length - 3} more features
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <div
                      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                        activePlan === index 
                          ? 'border-blue-500 bg-blue-500 shadow-lg shadow-blue-200/50' 
                          : 'border-gray-300 bg-white'
                      }`}
                    >
                      {activePlan === index && (
                        <div className="w-4 h-4 bg-white rounded-full" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile: Vertical List with Auto-Expanding Details */}
        <div className="sm:hidden space-y-3 mb-6">
          {plans.map((plan, index) => {
            const planMeta = plansMeta.find(meta => 
              meta.label.toLowerCase().replace('+', '-plus') === plan.name.toLowerCase().replace('+', '-plus')
            );
            const isExpanded = expandedPlan === index;
            const isSelected = activePlan === index;
            
            return (
              <div
                key={plan.name}
                className={`relative overflow-hidden rounded-2xl border-2 transition-all duration-300 ${
                  isSelected 
                    ? 'border-blue-500 bg-gradient-to-r from-blue-50/50 to-blue-100/30 shadow-lg shadow-blue-200/30' 
                    : 'border-gray-200 bg-white shadow-sm'
                }`}
              >
                {/* Main card content */}
                <div 
                  className="p-4 cursor-pointer"
                  onClick={() => handleChangePlan(index)}
                >
                  <div className="flex items-center justify-between">
                    {/* Left: Plan info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-bold text-lg text-gray-900">
                          {plan.name}
                        </h3>
                        {plan.popular && (
                          <span 
                            className="px-2 py-1 text-white text-[10px] font-bold rounded-full"
                            style={{ background: `linear-gradient(135deg, #1463B4, #12579C)` }}
                          >
                            Popular
                          </span>
                        )}
                        {(plan.name === 'Works+' || plan.name === 'Works') && (
                          <span className="bg-gradient-to-r from-red-500 to-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-full">
                            $5 First Month!
                          </span>
                        )}
                      </div>
                      
                      {/* Key features preview */}
                      <div className="text-xs text-gray-600 mb-2">
                        {planMeta?.features?.filter(f => f.included).slice(0, 2).map(f => f.name).join(" • ")}
                        {planMeta?.features && planMeta.features.filter(f => f.included).length > 2 && (
                          <span className="text-gray-400"> • +{planMeta.features.filter(f => f.included).length - 2} more</span>
                        )}
                      </div>

                      {/* Special offer pricing */}
                      {(plan.name === 'Works+' || plan.name === 'Works') && (
                        <div className="text-xs text-gray-400 line-through">
                          Regular: $
                          <NumberFlow
                            className="text-xs text-gray-400"
                            value={billingPeriod === 0 ? (plan.name === 'Works+' ? 39.99 : 34.99) : (plan.name === 'Works+' ? 399.99 : 349.99)}
                            format={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }}
                          />
                          /{billingPeriod === 0 ? 'mo' : 'yr'}
                        </div>
                      )}
                    </div>

                    {/* Right: Price and selection */}
                    <div className="flex items-center gap-3">
                      {/* Price */}
                      <div className="text-right">
                        <div className="flex items-baseline gap-0.5">
                          <span className="text-lg font-black text-gray-900">$</span>
                          <NumberFlow
                            className="text-2xl font-black text-gray-900"
                            value={getPrice(plan)}
                            format={{ minimumFractionDigits: 0, maximumFractionDigits: 0 }}
                          />
                          <span className="text-base font-semibold text-gray-600">
                            .
                            <NumberFlow
                              className="text-base font-semibold text-gray-600"
                              value={Math.round((getPrice(plan) % 1) * 100)}
                              format={{ minimumIntegerDigits: 2 }}
                            />
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 font-medium">
                          /{billingPeriod === 0 ? 'mo' : 'yr'}
                        </div>
                      </div>

                      {/* Selection indicator */}
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                          isSelected 
                            ? 'border-blue-500 bg-blue-500 shadow-lg shadow-blue-200/50' 
                            : 'border-gray-300 bg-white'
                        }`}
                      >
                        {isSelected && (
                          <div className="w-3 h-3 bg-white rounded-full" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Auto-expanding details */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-gray-100">
                        <div className="p-4">
                          <h4 className="text-sm font-semibold text-gray-900 mb-3">All Features:</h4>
                          <div className="grid grid-cols-1 gap-2">
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
                                <span className={feature.included ? '' : 'line-through'}>
                                  {feature.name}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Get Started Button */}
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

        {/* Footer */}
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