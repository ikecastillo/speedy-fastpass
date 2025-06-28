"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { getPlanByName, calculatePrice } from "@/types/plan";
import { getPlanById, calculatePlanPrice } from "@/lib/plans";
import { WashFeatures } from "@/components/WashFeatures";

interface PackageSummaryProps {
  planName: string;
  period: 'monthly' | 'yearly';
}

export function PackageSummary({ planName, period }: PackageSummaryProps) {
  const router = useRouter();
  const oldPlan = getPlanByName(planName);
  const newPlan = getPlanById(planName);

  // Use the new plan system or fall back to old system
  const plan = newPlan || oldPlan;
  const planId = newPlan ? newPlan.id : planName;

  if (!plan) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-red-600">Plan not found</p>
      </div>
    );
  }

  // Use new pricing if available
  const price = newPlan ? calculatePlanPrice(newPlan, period) : calculatePrice(oldPlan!, period);
  const periodDisplay = period === 'monthly' ? 'month' : 'year';
  const planName_display = newPlan ? newPlan.label : oldPlan!.name;

  const handleChangePlan = () => {
    router.push('/plan');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 h-fit">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Order Summary
      </h2>
      
      <div className="space-y-4">
        {/* Plan Details */}
        <div className="border-b border-gray-200 pb-4">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-medium text-gray-900">
              {planName_display}
            </h3>
            {(newPlan?.popular || oldPlan?.popular) && (
              <span className="py-1 px-2 rounded-lg bg-accent text-black text-sm font-medium">
                Popular
              </span>
            )}
          </div>
          
          <div className="text-2xl font-bold text-brand">
            ${price.toFixed(2)}
            <span className="text-sm font-normal text-gray-600">
              /{periodDisplay}
            </span>
          </div>
          
          {period === 'yearly' && (
            <p className="text-sm text-green-600 mt-1">
              Save ${newPlan ? (newPlan.monthly * 12 - price).toFixed(2) : oldPlan ? (oldPlan.monthlyPrice * 12 - price).toFixed(2) : '0'} annually
            </p>
          )}
        </div>

        {/* Plan Features */}
        <div className="space-y-2">
          <WashFeatures 
            planId={planId} 
            expanded={true} 
            collapsible={false}
          />
        </div>

        {/* Change Plan Link */}
        <div className="pt-4 border-t border-gray-200">
          <button
            onClick={handleChangePlan}
            className="text-brand hover:text-blue-900 text-sm font-medium underline"
          >
            Change plan
          </button>
        </div>
      </div>
    </div>
  );
} 