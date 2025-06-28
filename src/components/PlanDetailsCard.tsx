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
            className="rounded-[24px] bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 p-6"
          >
            <div className="text-center">
              <div className="text-3xl mb-3">🚗</div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                Speedy Wash
              </h3>
              <p className="text-sm md:text-base text-gray-600 mb-4">
                Please select a wash below for more details
              </p>
              <div className="text-xs text-gray-500 italic">
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
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{planData.icon}</span>
                    <div>
                      <h3 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2">
                        {planData.label}
                        {planData.popular && (
                          <span className="px-2 py-1 bg-accent text-black text-xs font-medium rounded-lg">
                            Popular
                          </span>
                        )}
                      </h3>
                      <p className="text-sm text-gray-600">{planData.tagline}</p>
                    </div>
                  </div>
                  
                  {/* Price Display */}
                  <div className="text-right">
                    <div className="text-2xl md:text-3xl font-bold text-brand">
                      ${billingPeriod === 'monthly' ? planData.monthly.toFixed(2) : planData.yearly.toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500">
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
                    className="mb-4 p-3 bg-green-100 border border-green-200 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-green-600">🎉</span>
                      <span className="text-sm font-medium text-green-800">
                        Special Offer: {planData.promo.text}
                      </span>
                    </div>
                  </motion.div>
                )}

                {/* Features List */}
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">What&apos;s included:</h4>
                  <div className="grid grid-cols-1 gap-2">
                    {planData.features.map((feature, index) => (
                      <motion.div
                        key={feature.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className={`flex items-center gap-3 text-sm ${
                          feature.included ? 'text-gray-700' : 'text-gray-400'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${
                          feature.included ? 'bg-green-100' : 'bg-gray-100'
                        }`}>
                          {feature.included ? (
                            <svg className="w-2.5 h-2.5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                          )}
                        </div>
                        <span className={feature.included ? '' : 'line-through'}>
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
                    className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg"
                  >
                    <div className="text-sm text-blue-800">
                      💰 Save ${((planData.monthly * 12) - planData.yearly).toFixed(2)} with annual billing!
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