"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getPlanById } from "@/lib/plans";

interface PlanDetailsCardProps {
  selectedPlanIndex: number | null;
  billingPeriod: 'monthly' | 'yearly';
}

export function PlanDetailsCard({ selectedPlanIndex, billingPeriod }: PlanDetailsCardProps) {
  // Get plan data if one is selected
  const planIds = ['basic', 'deluxe', 'works', 'works-plus'];
  const planData = selectedPlanIndex !== null ? getPlanById(planIds[selectedPlanIndex]) : null;
  
  return (
    <motion.div
      className="w-full mb-4"
      layout
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      <AnimatePresence mode="wait">
        {selectedPlanIndex === null ? (
          // Default State - No Plan Selected
          <motion.div
            key="default"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="rounded-[24px] bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-slate-200 p-8"
          >
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-brand/10 rounded-full flex items-center justify-center">
                <div className="w-8 h-8 bg-brand/20 rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-brand rounded-full"></div>
                </div>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                Speedy Wash
              </h3>
              <p className="text-sm md:text-base text-gray-600 mb-4">
                Please select a wash below for more details
              </p>
              <div className="text-xs text-gray-500 font-medium tracking-wide">
                Choose from our premium car care packages
              </div>
            </div>
          </motion.div>
        ) : (
          // Selected State - Show Plan Details
          <motion.div
            key={`plan-${selectedPlanIndex}`}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="rounded-[24px] bg-gradient-to-br from-brand/5 to-brand/10 border-2 border-brand/20 p-6"
          >
            {planData && (
              <div>
                {/* Plan Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-brand/10 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                      <div className="w-6 h-6 bg-brand/30 rounded-lg flex items-center justify-center">
                        <div className="w-3 h-3 bg-brand rounded-sm"></div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2 mb-1">
                        {planData.label}
                        {planData.popular && (
                          <span className="px-3 py-1 bg-accent text-black text-xs font-semibold rounded-full border border-yellow-600">
                            Most Popular
                          </span>
                        )}
                      </h3>
                      <p className="text-sm text-gray-600 font-medium">{planData.tagline}</p>
                    </div>
                  </div>
                  
                  {/* Price Display */}
                  <div className="text-right">
                    <div className="text-2xl md:text-3xl font-bold text-brand">
                      ${billingPeriod === 'monthly' ? planData.monthly.toFixed(2) : planData.yearly.toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500 font-medium">
                      per {billingPeriod === 'monthly' ? 'month' : 'year'}
                    </div>
                  </div>
                </div>

                {/* Promo Message */}
                {planData.promo && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                      </div>
                      <span className="text-sm font-semibold text-green-800">
                        Special Offer: {planData.promo.text}
                      </span>
                    </div>
                  </motion.div>
                )}

                {/* Features List */}
                <div className="space-y-3">
                  <h4 className="text-base font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                    What&apos;s included:
                  </h4>
                  <div className="grid grid-cols-1 gap-3 max-h-64 overflow-y-auto">
                    {planData.features.map((feature, index) => (
                      <motion.div
                        key={feature.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 * index }}
                        className={`flex items-center gap-4 p-2 rounded-lg transition-all duration-200 ${
                          feature.included 
                            ? 'text-gray-800 bg-green-50 border border-green-100' 
                            : 'text-gray-400 bg-gray-50 border border-gray-100'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                          feature.included ? 'bg-green-500' : 'bg-gray-300'
                        }`}>
                          {feature.included ? (
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        <span className={`text-sm font-medium ${feature.included ? '' : 'line-through'}`}>
                          {feature.name}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Savings Message */}
                {billingPeriod === 'yearly' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                      </div>
                      <div className="text-sm font-semibold text-blue-800">
                        Save ${((planData.monthly * 12) - planData.yearly).toFixed(2)} with annual billing!
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
} 