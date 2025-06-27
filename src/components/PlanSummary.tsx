"use client";

import React from "react";
import Link from "next/link";
import { getPlanByName, calculatePrice } from "@/types/plan";

interface PlanSummaryProps {
  planName: string;
  period: 'monthly' | 'yearly';
}

export function PlanSummary({ planName, period }: PlanSummaryProps) {
  const plan = getPlanByName(planName);
  
  if (!plan) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Selected Plan</h3>
        <p className="text-gray-600">No plan selected</p>
        <Link
          href="/plan"
          className="inline-block mt-4 px-4 py-2 bg-brand text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Select Plan
        </Link>
      </div>
    );
  }

  const price = calculatePrice(plan, period);
  const savings = period === 'yearly' ? (plan.monthlyPrice * 12) - price : 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Selected Plan</h3>
        <Link
          href="/plan"
          className="text-sm text-brand hover:text-blue-700 font-medium transition-colors"
        >
          Change Plan
        </Link>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Plan:</span>
          <span className="font-semibold text-gray-900">{plan.name}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Billing:</span>
          <span className="font-medium capitalize">{period}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Price:</span>
          <span className="font-semibold text-lg">${price.toFixed(2)}</span>
        </div>
        
        {savings > 0 && (
          <div className="flex items-center justify-between text-green-600">
            <span>Annual Savings:</span>
            <span className="font-semibold">${savings.toFixed(2)}</span>
          </div>
        )}
      </div>
    </div>
  );
} 