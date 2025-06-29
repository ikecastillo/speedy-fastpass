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
          // Default State - Clean hero image only
          <motion.div
            key="default"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            {/* Full-width hero image with parallax-ready structure */}
            <div className="h-64 md:h-80 lg:h-96 w-full relative overflow-hidden">
              <Image
                src="/SpeedyAtDay.PNG"
                alt="Speedy Wash car wash facility exterior with modern equipment and professional signage"
                fill
                className="object-cover"
                priority
                sizes="100vw"
              />
              {/* Subtle gradient overlay for better text contrast later */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/20"></div>
            </div>
          </motion.div>
        ) : (
          // Selected State - Show Plan Details with modern shadow
          <motion.div
            key={`plan-${selectedPlanIndex}`}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="relative"
            style={{
              // Modern shadow coming from top
              boxShadow: `
                0 -20px 40px -10px rgba(11, 37, 69, 0.15),
                0 -10px 20px -5px rgba(11, 37, 69, 0.1),
                0 -5px 10px -2px rgba(11, 37, 69, 0.05)
              `
            }}
          >
            <div className="rounded-[24px] bg-gradient-to-br from-brand/5 to-brand/10 border-2 border-brand/20 p-4 bg-white">
              {planData && (
                <div className="flex flex-col">
                  {/* Enhanced Speedy Wash Branding with plus as exponent */}
                  <div className="mb-3 text-center">
                    <div 
                      className="px-4 py-2 rounded-full inline-flex items-start justify-center shadow-sm"
                      style={{ backgroundColor: '#F5F7FA' }}
                    >
                      <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#474D55' }}>
                        Speedy Wash
                        <span 
                          className="text-xs font-bold ml-1"
                          style={{ 
                            color: '#FFD60A',
                            verticalAlign: 'super',
                            fontSize: '0.7em'
                          }}
                        >
                          +
                        </span>
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
                        <h3 className="text-lg font-bold flex items-center gap-2" style={{ color: '#2F343A' }}>
                          {planData.label}
                          {planData.popular && (
                            <span 
                              className="px-3 py-1 text-white text-xs font-bold rounded-full shadow-md border"
                              style={{
                                background: `linear-gradient(45deg, #1463B4, #12579C)`,
                                borderColor: '#0E4377'
                              }}
                            >
                              Most Popular
                            </span>
                          )}
                        </h3>
                        <p className="text-xs" style={{ color: '#6F7780' }}>{planData.tagline}</p>
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
                      <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#6F7780' }}>
                        per {billingPeriod === 'monthly' ? 'month' : 'year'}
                      </div>
                    </div>
                  </div>

                  {/* Compact Features - 2 Column Grid */}
                  <div>
                    <h4 className="text-sm font-bold mb-2" style={{ color: '#2F343A' }}>What&apos;s included:</h4>
                    <div>
                      <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                        {planData.features.map((feature, index) => (
                          <motion.div
                            key={feature.name}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.03 * index }}
                            className={`flex items-center gap-1.5 text-xs ${
                              feature.included ? '' : ''
                            }`}
                            style={{ color: feature.included ? '#474D55' : '#9EA5AD' }}
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
                        className="mt-3 p-2 rounded-lg"
                        style={{ backgroundColor: '#F5F7FA' }}
                      >
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full flex-shrink-0"
                            style={{ backgroundColor: '#1463B4' }}
                          ></div>
                          <div className="text-xs font-semibold" style={{ color: '#0B2545' }}>
                            Save ${((planData.monthly * 12) - planData.yearly).toFixed(2)} annually!
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
} 