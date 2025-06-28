"use client";

import React from "react";

interface StepperProps {
  currentStep: number;
}

const steps = [
  { number: 1, label: "Plan", path: "/" },
  { number: 2, label: "Vehicle", path: "/checkout/vehicle" },
  { number: 3, label: "Payment", path: "/checkout/payment" },
  { number: 4, label: "Success", path: "/checkout/success" },
];

export function Stepper({ currentStep }: StepperProps) {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-3 md:p-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            {/* Step Circle and Label */}
            <div className="flex flex-col items-center">
              <div
                className={`
                  w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-xs md:text-sm font-semibold
                  ${
                    currentStep >= step.number
                      ? "bg-brand text-white"
                      : "bg-gray-200 text-gray-600"
                  }
                  transition-colors duration-300
                `}
              >
                {currentStep > step.number ? (
                  <svg
                    className="w-4 h-4 md:w-5 md:h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  step.number
                )}
              </div>
              <span
                className={`
                  mt-1 md:mt-2 text-xs md:text-sm font-medium
                  ${
                    currentStep >= step.number
                      ? "text-brand"
                      : "text-gray-500"
                  }
                `}
              >
                {step.label}
              </span>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div
                className={`
                  flex-1 h-0.5 mx-4
                  ${
                    currentStep > step.number
                      ? "bg-brand"
                      : "bg-gray-200"
                  }
                  transition-colors duration-300
                `}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
} 