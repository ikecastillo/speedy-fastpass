import { Stepper } from "@/components/Stepper";

export default function PaymentPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Stepper currentStep={3} />
      <div className="max-w-2xl mx-auto p-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Payment Information
          </h1>
          <p className="text-gray-600">
            This page will contain the Stripe Payment Element.
            Coming in Phase 5!
          </p>
        </div>
      </div>
    </div>
  );
} 