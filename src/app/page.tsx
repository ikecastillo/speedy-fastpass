import { PricingSelector } from "@/components/PricingSelector";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile-optimized container with minimal padding */}
      <div className="flex items-center justify-center px-4 py-8">
        <PricingSelector />
      </div>
    </div>
  );
}
