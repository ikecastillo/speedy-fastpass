"use client";

import Link from 'next/link';
import { plansMeta, calculatePlanPrice } from '@/lib/plans';

export function PlansGrid() {
  return (
    <section id="plans" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            From basic cleaning to ultimate protection, we have a plan that fits your needs and budget.
          </p>
        </div>

        {/* Plans grid - use horizontal scroll on mobile */}
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-6 min-w-fit lg:grid lg:grid-cols-4 lg:gap-6">
            {plansMeta.map((plan) => (
              <div
                key={plan.id}
                className={`relative flex-shrink-0 w-72 lg:w-auto bg-white border-2 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg ${
                  plan.popular 
                    ? 'border-brand shadow-md transform scale-105' 
                    : 'border-gray-200 hover:border-brand'
                }`}
              >
                {/* Popular badge */}
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-brand text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}

                {/* Promo ribbon for Works and Works+ */}
                {plan.promo && (
                  <div className="absolute -top-3 -right-3">
                    <div className="bg-accent text-gray-900 px-3 py-1 rounded-full text-sm font-bold border-2 border-yellow-600">
                      {plan.promo.text}
                    </div>
                  </div>
                )}

                {/* Plan icon and name */}
                <div className="text-center mb-6">
                  <div className="text-4xl mb-3">{plan.icon}</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.label}</h3>
                  <p className="text-gray-600">{plan.tagline}</p>
                </div>

                {/* Pricing */}
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    ${calculatePlanPrice(plan, 'monthly').toFixed(2)}
                  </div>
                  <div className="text-gray-600">per month</div>
                  <div className="text-sm text-gray-500 mt-1">
                    or ${calculatePlanPrice(plan, 'yearly').toFixed(2)}/year
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-3 mb-8">
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

                {/* CTA Button */}
                <Link
                  href="/plan"
                  className={`block w-full text-center font-semibold py-3 px-6 rounded-xl transition-colors ${
                    plan.popular
                      ? 'bg-brand text-white hover:bg-blue-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  Choose {plan.label}
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile scroll hint */}
        <div className="lg:hidden text-center mt-4">
          <p className="text-sm text-gray-500">← Scroll to see all plans →</p>
        </div>
      </div>
    </section>
  );
} 