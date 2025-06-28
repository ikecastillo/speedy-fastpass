"use client";

import React from "react";
import Link from "next/link";
import { getPlanById, calculatePlanPrice } from "@/lib/plans";

interface PlanSummaryProps {
  planName: string;
  period: 'monthly' | 'yearly';
}

export function PlanSummary({ planName, period }: PlanSummaryProps) {
  // Convert plan name to id format
  const planId = planName.toLowerCase().replace('+', '-plus');
  const plan = getPlanById(planId);
  
  if (!plan) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
        <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4">Selected Plan</h3>
        <p className="text-gray-600 text-sm">No plan selected</p>
        <Link
          href="/"
          className="inline-block mt-4 px-4 py-2 bg-brand text-white rounded-lg font-medium hover:bg-blue-900 transition-colors text-sm"
        >
          Select Plan
        </Link>
      </div>
    );
  }

  const price = calculatePlanPrice(plan, period);
  const savings = period === 'yearly' ? (plan.monthly * 12) - price : 0;
  const includedFeatures = plan.features.filter(feature => feature.included);

  return (
    <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
      {/* Header with Plan Info */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{plan.icon}</span>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg md:text-xl font-bold text-gray-900">{plan.label}</h3>
              {plan.popular && (
                <span className="px-2 py-1 bg-accent text-black text-xs font-medium rounded-lg">
                  Popular
                </span>
              )}
            </div>
            <p className="text-xs md:text-sm text-gray-600">{plan.tagline}</p>
          </div>
        </div>
        <Link
          href="/"
          className="text-xs md:text-sm text-brand hover:text-blue-900 font-medium transition-colors"
        >
          Change
        </Link>
      </div>

      {/* Price Section */}
      <div className="bg-gray-50 rounded-lg p-3 mb-4">
        <div className="flex items-baseline justify-between">
          <div>
            <span className="text-2xl md:text-3xl font-bold text-gray-900">
              ${price.toFixed(2)}
            </span>
            <span className="text-sm text-gray-600 ml-1">
              /{period === 'monthly' ? 'month' : 'year'}
            </span>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500 capitalize">{period} billing</div>
            {savings > 0 && (
              <div className="text-xs text-green-600 font-medium">
                Save ${savings.toFixed(2)}/year
              </div>
            )}
          </div>
        </div>

        {/* Promo Information */}
        {plan.promo && (
          <div className="mt-2 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded text-center">
            🎉 {plan.promo.text}
          </div>
        )}
      </div>

      {/* What's Included */}
      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-2">What&apos;s included:</h4>
        <div className="space-y-1.5">
          {includedFeatures.map((feature, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-2.5 h-2.5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-xs md:text-sm text-gray-700">{feature.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile-friendly CTA */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-2">
            Unlimited washes • Cancel anytime
          </p>
          <div className="text-xs text-brand font-medium">
            Next: Enter payment details →
          </div>
        </div>
      </div>
    </div>
  );
} 