"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { getPlanByName, calculatePrice } from "@/types/plan";

interface PackageSummaryProps {
  planName: string;
  period: 'monthly' | 'yearly';
}

export function PackageSummary({ planName, period }: PackageSummaryProps) {
  const router = useRouter();
  const plan = getPlanByName(planName);

  if (!plan) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-red-600">Plan not found</p>
      </div>
    );
  }

  const price = calculatePrice(plan, period);
  const periodDisplay = period === 'monthly' ? 'month' : 'year';

  const handleChangePlan = () => {
    router.push('/plan');
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-brand/20 p-6 h-fit">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Order Summary
      </h2>
      
      <div className="space-y-4">
        {/* Plan Details */}
        <div className="border-b border-gray-200 pb-4">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-medium text-gray-900">
              {plan.name}
            </h3>
            {plan.popular && (
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
              Save ${(plan.monthlyPrice * 12 - price).toFixed(2)} annually
            </p>
          )}
        </div>

        {/* Plan Features */}
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900">Includes:</h4>
          <ul className="space-y-1 text-sm text-gray-600">
            <li>• Unlimited car washes</li>
            <li>• Premium soap & wax</li>
            <li>• Interior vacuuming</li>
            {(plan.name === 'Deluxe' || plan.name === 'Works' || plan.name === 'Works+') && (
              <li>• Tire shine service</li>
            )}
            {(plan.name === 'Works' || plan.name === 'Works+') && (
              <li>• Interior detailing</li>
            )}
            {plan.name === 'Works+' && (
              <li>• Premium air freshener</li>
            )}
          </ul>
        </div>

        {/* Change Plan Link */}
        <div className="pt-4 border-t border-gray-200">
          <button
            onClick={handleChangePlan}
            className="text-brand hover:text-blue-700 text-sm font-medium underline"
          >
            Change plan
          </button>
        </div>
      </div>
    </div>
  );
} 