import { PricingSelector } from "@/components/PricingSelector";
import { Stepper } from "@/components/Stepper";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Speedy Wash Header - Mobile First */}
      <div className="text-center pt-4 pb-1 px-4">
        <h1 className="text-xl md:text-3xl font-bold text-gray-900 mb-0.5">
          Speedy Wash
        </h1>
        <p className="text-xs md:text-base text-gray-600">
          Choose your unlimited car wash plan
        </p>
      </div>
      
      <Stepper currentStep={1} />
      
      {/* Mobile-optimized container with minimal padding */}
      <div className="flex items-center justify-center px-4 pb-4">
        <PricingSelector />
      </div>
    </div>
  );
}
