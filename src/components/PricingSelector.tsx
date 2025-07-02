"use client";

import NumberFlow from '@number-flow/react'
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { plans, calculatePrice, type Plan } from "@/types/plan";
import { plansMeta } from "@/lib/plans";
import { PersistentPlanBar } from "./PersistentPlanBar";

interface PricingSelectorProps {
  activePlan: number | null;
  setActivePlan: (index: number | null) => void;
  billingPeriod: number;
  setBillingPeriod: (period: number) => void;
}

export function PricingSelector({ activePlan, setActivePlan, billingPeriod, setBillingPeriod }: PricingSelectorProps) {
  const [expandedPlan, setExpandedPlan] = useState<number | null>(null);

  // Auto-expand details when a plan is selected
  useEffect(() => {
    if (activePlan !== null) {
      setExpandedPlan(activePlan);
    }
  }, [activePlan]);

  const handleChangePlan = (index: number) => {
    // Toggle functionality - unselect if clicking the same plan
    if (activePlan === index) {
      setActivePlan(null);
      setExpandedPlan(null);
    } else {
      setActivePlan(index);
      setExpandedPlan(index);
    }
  };

  const handleChangePeriod = (index: number) => {
    setBillingPeriod(index);
  };



  const getPrice = (plan: Plan) => {
    const period = billingPeriod === 0 ? 'monthly' : 'yearly';
    return calculatePrice(plan, period);
  };

  const toggleExpanded = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedPlan(expandedPlan === index ? null : index);
  };

  return (
    <div className="w-full">
      <div className="rounded-3xl">

        {/* Billing Period Toggle */}
        <div className="px-4 sm:px-6 lg:px-8">
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
        </div>

        {/* Desktop: 2x2 Grid with Expandable Cards */}
        <div className="hidden sm:grid sm:grid-cols-2 gap-4 mb-8 px-4 sm:px-6 lg:px-8">
          {plans.map((plan, index) => {
            const planMeta = plansMeta.find(meta => 
              meta.label.toLowerCase().replace('+', '-plus') === plan.name.toLowerCase().replace('+', '-plus')
            );
            const isExpanded = expandedPlan === index;
            const isSelected = activePlan === index;
            const isWorksPlus = plan.name === 'Works+';
            
            return (
              <div
                key={plan.name}
                className={`relative overflow-hidden rounded-3xl border cursor-pointer transition-all duration-300 ${
                  isSelected 
                    ? 'border-blue-500 bg-gradient-to-br from-blue-50/50 to-blue-100/30 shadow-xl shadow-blue-200/40 scale-105' 
                    : isWorksPlus
                    ? 'border-gradient bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 hover:from-blue-700 hover:via-blue-800 hover:to-purple-800 shadow-lg shadow-blue-200/50 hover:shadow-xl hover:shadow-blue-300/60 hover:scale-102'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-lg shadow-sm hover:scale-102'
                }`}
                onClick={() => handleChangePlan(index)}
              >
                <div className={`p-6 h-full flex flex-col ${isWorksPlus && !isSelected ? 'text-white' : ''}`}>
                  <div className="text-center mb-6">
                    <h3 className={`font-bold text-2xl mb-2 ${isWorksPlus && !isSelected ? 'text-white' : 'text-gray-900'}`}>
                      {plan.name}
                    </h3>
                    
                    <div className="flex items-baseline justify-center gap-1 mb-2">
                      <span className={`text-2xl font-black ${isWorksPlus && !isSelected ? 'text-white' : 'text-gray-900'}`}>$</span>
                      <NumberFlow
                        className={`text-4xl font-black ${isWorksPlus && !isSelected ? 'text-white' : 'text-gray-900'}`}
                        value={Math.floor(getPrice(plan))}
                        format={{ minimumFractionDigits: 0, maximumFractionDigits: 0 }}
                      />
                      <span className={`text-xl font-semibold ${isWorksPlus && !isSelected ? 'text-blue-100' : 'text-gray-600'}`}>
                        .
                        <NumberFlow
                          className={`text-xl font-semibold ${isWorksPlus && !isSelected ? 'text-blue-100' : 'text-gray-600'}`}
                          value={Math.round((getPrice(plan) % 1) * 100)}
                          format={{ minimumIntegerDigits: 2 }}
                        />
                      </span>
                      <span className={`text-sm font-medium ml-1 ${isWorksPlus && !isSelected ? 'text-blue-200' : 'text-gray-500'}`}>
                        /{billingPeriod === 0 ? 'mo' : 'yr'}
                      </span>
                    </div>
                  </div>

                  <div className="flex-grow mb-6">
                    <div className="space-y-3">
                      {planMeta?.features?.filter(f => f.included).slice(0, 3).map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                            isWorksPlus && !isSelected ? 'bg-blue-300' : 'bg-green-500'
                          }`}>
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <span className={`text-sm font-medium ${isWorksPlus && !isSelected ? 'text-white' : 'text-gray-700'}`}>
                            {feature.name}
                          </span>
                        </div>
                      ))}
                      {planMeta?.features && planMeta.features.filter(f => f.included).length > 3 && (
                        <button
                          onClick={(e) => toggleExpanded(index, e)}
                          className={`text-xs font-medium hover:opacity-80 transition-all ${
                            isWorksPlus && !isSelected ? 'text-blue-200 hover:text-white' : 'text-blue-500 hover:text-blue-600'
                          }`}
                        >
                          {isExpanded ? 'Show Less' : `+${planMeta.features.filter(f => f.included).length - 3} more features`}
                        </button>
                      )}
                    </div>
                    
                    {/* Expandable features for desktop */}
                    <AnimatePresence>
                      {isExpanded && planMeta?.features && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="overflow-hidden mt-3"
                        >
                          <div className={`space-y-3 pt-3 border-t ${isWorksPlus && !isSelected ? 'border-blue-400' : 'border-gray-100'}`}>
                            {planMeta.features.filter(f => f.included).slice(3).map((feature, featureIndex) => (
                              <div key={featureIndex} className="flex items-center gap-3">
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                                  isWorksPlus && !isSelected ? 'bg-blue-300' : 'bg-green-500'
                                }`}>
                                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                </div>
                                <span className={`text-sm font-medium ${isWorksPlus && !isSelected ? 'text-white' : 'text-gray-700'}`}>
                                  {feature.name}
                                </span>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="flex justify-center">
                    <div
                      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                        isSelected 
                          ? 'border-blue-500 bg-blue-500 shadow-lg shadow-blue-200/50' 
                          : isWorksPlus
                          ? 'border-white bg-white/20 backdrop-blur-sm'
                          : 'border-gray-300 bg-white'
                      }`}
                    >
                      {isSelected && (
                        <div className="w-4 h-4 bg-white rounded-full" />
                      )}
                      {!isSelected && isWorksPlus && (
                        <div className="w-4 h-4 bg-white rounded-full opacity-60" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile: Vertical List with Auto-Expanding Details */}
        <div className="sm:hidden space-y-3 mb-6 px-4 sm:px-6 lg:px-8">
          {plans.map((plan, index) => {
            const planMeta = plansMeta.find(meta => 
              meta.label.toLowerCase().replace('+', '-plus') === plan.name.toLowerCase().replace('+', '-plus')
            );
            const isExpanded = expandedPlan === index;
            const isSelected = activePlan === index;
            const isWorksPlus = plan.name === 'Works+';
            
            return (
              <div
                key={plan.name}
                className={`relative overflow-hidden rounded-2xl border transition-all duration-300 ${
                  isSelected 
                    ? 'border-blue-500 bg-gradient-to-r from-blue-50/50 to-blue-100/30 shadow-lg shadow-blue-200/30' 
                    : isWorksPlus
                    ? 'bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 border-blue-500 shadow-lg shadow-blue-200/50'
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
                        <h3 className={`font-bold text-lg ${isWorksPlus && !isSelected ? 'text-white' : 'text-gray-900'}`}>
                          {plan.name}
                        </h3>
                      </div>
                      
                      {/* Key features preview */}
                      <div className={`text-xs mb-2 ${isWorksPlus && !isSelected ? 'text-blue-100' : 'text-gray-600'}`}>
                        {planMeta?.features?.filter(f => f.included).slice(0, 2).map(f => f.name).join(" • ")}
                        {planMeta?.features && planMeta.features.filter(f => f.included).length > 2 && (
                          <span className={isWorksPlus && !isSelected ? 'text-blue-200' : 'text-gray-400'}> • +{planMeta.features.filter(f => f.included).length - 2} more</span>
                        )}
                      </div>
                    </div>

                    {/* Right: Price and selection */}
                    <div className="flex items-center gap-3">
                      {/* Price */}
                      <div className="text-right">
                        <div className="flex items-baseline gap-0.5 whitespace-nowrap">
                          <span className={`text-lg font-black ${isWorksPlus && !isSelected ? 'text-white' : 'text-gray-900'}`}>$</span>
                          <NumberFlow
                            className={`text-2xl font-black ${isWorksPlus && !isSelected ? 'text-white' : 'text-gray-900'}`}
                            value={Math.floor(getPrice(plan))}
                            format={{ minimumFractionDigits: 0, maximumFractionDigits: 0 }}
                          />
                          <span className={`text-base font-semibold ${isWorksPlus && !isSelected ? 'text-blue-100' : 'text-gray-600'}`}>
                            .
                            <NumberFlow
                              className={`text-base font-semibold ${isWorksPlus && !isSelected ? 'text-blue-100' : 'text-gray-600'}`}
                              value={Math.round((getPrice(plan) % 1) * 100)}
                              format={{ minimumIntegerDigits: 2 }}
                            />
                          </span>
                          <span className={`text-xs font-medium ${isWorksPlus && !isSelected ? 'text-blue-200' : 'text-gray-500'}`}>
                            /{billingPeriod === 0 ? 'mo' : 'yr'}
                          </span>
                        </div>
                      </div>

                      {/* Selection indicator */}
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                          isSelected 
                            ? 'border-blue-500 bg-blue-500 shadow-lg shadow-blue-200/50' 
                            : isWorksPlus
                            ? 'border-white bg-white/20 backdrop-blur-sm'
                            : 'border-gray-300 bg-white'
                        }`}
                      >
                        {isSelected && (
                          <div className="w-3 h-3 bg-white rounded-full" />
                        )}
                        {!isSelected && isWorksPlus && (
                          <div className="w-3 h-3 bg-white rounded-full opacity-60" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expandable details button */}
                <button
                  onClick={(e) => toggleExpanded(index, e)}
                  className={`w-full px-4 py-2 border-t text-xs font-medium transition-colors flex items-center justify-center gap-1 ${
                    isWorksPlus && !isSelected 
                      ? 'border-blue-400 bg-blue-800/30 text-blue-100 hover:bg-blue-800/50' 
                      : 'border-gray-100 bg-gray-50/50 text-gray-600 hover:bg-gray-100/50'
                  }`}
                >
                  {isExpanded ? 'Hide Details' : 'Show All Features'}
                  <svg 
                    className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>

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
                      <div className={`border-t ${isWorksPlus && !isSelected ? 'border-blue-400' : 'border-gray-100'}`}>
                        <div className={`p-4 ${isWorksPlus && !isSelected ? 'bg-blue-800/20' : ''}`}>
                          <h4 className={`text-sm font-semibold mb-3 ${isWorksPlus && !isSelected ? 'text-white' : 'text-gray-900'}`}>All Features:</h4>
                          <div className="grid grid-cols-1 gap-2">
                            {planMeta?.features?.map((feature, featureIndex) => (
                              <div key={featureIndex} className={`flex items-center gap-2 text-xs ${
                                feature.included 
                                  ? isWorksPlus && !isSelected ? 'text-white' : 'text-gray-700'
                                  : isWorksPlus && !isSelected ? 'text-blue-300' : 'text-gray-400'
                              }`}>
                                <div className={`w-3 h-3 rounded flex items-center justify-center flex-shrink-0 ${
                                  feature.included 
                                    ? isWorksPlus && !isSelected ? 'bg-blue-300' : 'bg-green-500'
                                    : 'bg-gray-300'
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

        {/* Get Started Button - Hidden when plan is selected */}
        {activePlan === null && (
          <div className="px-4 sm:px-6 lg:px-8">
            <motion.button 
              className="w-full max-w-md mx-auto block rounded-xl sm:rounded-2xl text-base sm:text-lg font-bold py-3 sm:py-4 px-4 sm:px-6 transition-all duration-300 shadow-lg bg-gray-200 text-gray-500 cursor-not-allowed shadow-gray-200/30"
              disabled={true}
            >
              Select a plan to continue
            </motion.button>
          </div>
        )}

        {/* Persistent Plan Bar */}
        <PersistentPlanBar 
          activePlan={activePlan}
          billingPeriod={billingPeriod}
          currentStep="pricing"
          continueText="Get Started"
        />

        {/* Footer */}
        <div className="text-center mt-4 sm:mt-6 space-y-1 px-4 sm:px-6 lg:px-8">
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