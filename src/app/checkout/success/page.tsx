import { Stepper } from "@/components/Stepper";

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Stepper currentStep={4} />
      <div className="max-w-2xl mx-auto p-8">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Success!
          </h1>
          <p className="text-gray-600">
            This page will contain confetti and thank-you message.
            Coming in Phase 6!
          </p>
        </div>
      </div>
    </div>
  );
} 