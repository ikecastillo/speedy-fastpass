import { PricingSelector } from "@/components/PricingSelector";
import { Stepper } from "@/components/Stepper";

export default function PlanPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Stepper currentStep={1} />
      <div className="flex items-center justify-center p-8">
        <PricingSelector />
      </div>
    </div>
  );
} 