"use client";

import React, { useState } from 'react';
import { getPlanById, type PlanMeta } from '@/lib/plans';

interface WashFeaturesProps {
  planId: string;
  expanded?: boolean;
  collapsible?: boolean;
  className?: string;
}

export function WashFeatures({ 
  planId, 
  expanded = false, 
  collapsible = true,
  className = ""
}: WashFeaturesProps) {
  const [isExpanded, setIsExpanded] = useState(expanded);
  const plan = getPlanById(planId);

  if (!plan) {
    return null;
  }

  const toggleExpanded = () => {
    if (collapsible) {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <div className={`${className}`}>
      {/* Header */}
      {collapsible ? (
        <button
          onClick={toggleExpanded}
          className="w-full flex items-center justify-between p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <span className="font-medium text-gray-900">Features</span>
          <svg
            className={`w-5 h-5 text-gray-500 transition-transform ${
              isExpanded ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      ) : (
        <h4 className="font-medium text-gray-900 mb-3">What's Included</h4>
      )}

      {/* Features List */}
      {(isExpanded || !collapsible) && (
        <div className={`${collapsible ? 'mt-3' : ''} space-y-2`}>
          {plan.features.map((feature, index) => (
            <div key={index} className="flex items-center">
              <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mr-3 ${
                feature.included ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
              }`}>
                {feature.included ? (
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <span className={`text-sm ${feature.included ? 'text-gray-900' : 'text-gray-500'}`}>
                {feature.name}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 