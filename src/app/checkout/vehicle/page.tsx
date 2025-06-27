import { Stepper } from "@/components/Stepper";

export default function VehiclePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Stepper currentStep={2} />
      <div className="max-w-2xl mx-auto p-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Vehicle & Personal Information
          </h1>
          <p className="text-gray-600">
            This page will contain the vehicle and personal information form.
            Coming in Phase 4!
          </p>
        </div>
      </div>
    </div>
  );
} 