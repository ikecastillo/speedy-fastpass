"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
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
      className="w-full"
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
            className="rounded-[24px] border-2 border-slate-200 overflow-hidden bg-white"
          >
            {/* Beautiful facility image - larger showcase */}
            <div className="h-48 w-full relative overflow-hidden">
              <Image
                src="/SpeedyAtDay.PNG"
                alt="Speedy Wash car wash facility exterior with modern equipment and professional signage"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 448px"
              />
              {/* Subtle gradient at bottom for text transition */}
              <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white/80 to-transparent z-10"></div>
            </div>
            
            {/* Compact text section below image */}
            <div className="p-4 text-center bg-white">
              <div className="mb-2 px-3 py-1.5 bg-slate-100 rounded-full inline-flex items-center justify-center">
                <span className="text-xs font-bold text-gray-700 uppercase tracking-widest">
                  Speedy Wash
                </span>
              </div>
              <h3 className="text-base md:text-lg font-bold text-gray-900 mb-1">
                Choose Your Plan
              </h3>
              <p className="text-sm text-gray-600 mb-1">
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
            className="rounded-[24px] bg-gradient-to-br from-brand/5 to-brand/10 border-2 border-brand/20 p-4"
          >
            {planData && (
              <div className="flex flex-col">
                {/* Speedy Wash Branding */}
                <div className="mb-3 text-center">
                  <div className="px-3 py-2 bg-slate-200 rounded-full inline-flex items-center justify-center">
                    <span className="text-xs font-bold text-gray-700 uppercase tracking-widest">
                      Speedy Wash
                    </span>
                  </div>
                </div>
                
                {/* Compact Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-brand/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <div className="w-4 h-4 bg-brand/30 rounded flex items-center justify-center">
                        <div className="w-2 h-2 bg-brand rounded-sm"></div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        {planData.label}
                        {planData.popular && (
                          <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-bold rounded-full shadow-md border border-blue-700">
                            Most Popular
                          </span>
                        )}
                      </h3>
                      <p className="text-xs text-gray-600">{planData.tagline}</p>
                    </div>
                  </div>
                  
                  {/* Clean Price Display */}
                  <div className="text-right">
                    <div className="flex items-baseline gap-1 justify-end">
                      <span className="text-lg font-black text-brand">$</span>
                      <span className="text-2xl font-black text-brand">
                        {billingPeriod === 'monthly' ? planData.monthly.toFixed(0) : planData.yearly.toFixed(0)}
                      </span>
                      <span className="text-sm font-semibold text-brand">
                        .{billingPeriod === 'monthly' ? planData.monthly.toFixed(2).split('.')[1] : planData.yearly.toFixed(2).split('.')[1]}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      per {billingPeriod === 'monthly' ? 'month' : 'year'}
                    </div>
                  </div>
                </div>



                {/* Compact Features - 2 Column Grid */}
                <div>
                  <h4 className="text-sm font-bold text-gray-900 mb-2">What&apos;s included:</h4>
                  <div>
                    <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                      {planData.features.map((feature, index) => (
                        <motion.div
                          key={feature.name}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.03 * index }}
                          className={`flex items-center gap-1.5 text-xs ${
                            feature.included ? 'text-gray-700' : 'text-gray-400'
                          }`}
                        >
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
                          <span className={`truncate ${feature.included ? '' : 'line-through'}`}>
                            {feature.name}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Compact Savings at Bottom */}
                  {billingPeriod === 'yearly' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="mt-3 p-2 bg-blue-50 rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0"></div>
                        <div className="text-xs font-semibold text-blue-800">
                          Save ${((planData.monthly * 12) - planData.yearly).toFixed(2)} annually!
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
} 