"use client";

import { Suspense } from "react";
import { Stepper } from "@/components/Stepper";
import { VehicleFormComponent } from "@/components/VehicleForm";

export default function VehiclePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Stepper currentStep={2} />
      <div className="max-w-4xl mx-auto p-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Vehicle & Personal Information
          </h1>
          <Suspense fallback={<div className="text-center py-4">Loading form...</div>}>
            <VehicleFormComponent />
          </Suspense>
        </div>
      </div>
    </div>
  );
} 