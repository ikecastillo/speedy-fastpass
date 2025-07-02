"use client";

import React from "react";
import { useRouter } from "next/navigation";

import { StripeProvider } from "@/components/StripeProvider";
import { StripePaymentForm } from "@/components/StripePaymentForm";
import { PersistentPlanBar } from "@/components/PersistentPlanBar";
import { createCheckout, type CheckoutData } from "@/app/actions/createCheckout";
import { plans } from "@/types/plan";

export default function PaymentPage() {
  const router = useRouter();
  const [planData, setPlanData] = React.useState<{
    plan: string; 
    period: string;
    activePlan: number | null;
    billingPeriod: number;
  } | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [stripeData, setStripeData] = React.useState<{
    clientSecret: string;
    subscriptionId: string;
  } | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function initializePayment() {
      if (typeof window !== 'undefined') {
        // Get plan data
        const storedPlan = localStorage.getItem('selectedPlan') || localStorage.getItem('checkoutPlan');
        if (!storedPlan) {
          router.push('/');
          return;
        }

        // Get vehicle and customer data
        const vehicleFormData = localStorage.getItem('vehicleFormData');
        if (!vehicleFormData) {
          router.push('/checkout/vehicle');
          return;
        }

        const planInfo = JSON.parse(storedPlan);
        const vehicleInfo = JSON.parse(vehicleFormData);

        // Find the plan index based on the stored plan name
        const planIndex = plans.findIndex(plan => 
          plan.name.toLowerCase().replace('+', '-plus') === planInfo.plan.toLowerCase()
        );

        setPlanData({
          plan: planInfo.plan,
          period: planInfo.period,
          activePlan: planIndex >= 0 ? planIndex : null,
          billingPeriod: planInfo.period === 'yearly' ? 1 : 0
        });

        // Create Stripe checkout session
        try {
          const checkoutData: CheckoutData = {
            plan: planInfo.plan,
            period: planInfo.period,
            customerInfo: {
              email: vehicleInfo.email,
              firstName: vehicleInfo.firstName,
              lastName: vehicleInfo.lastName,
              phone: vehicleInfo.phone,
            },
            vehicleInfo: {
              make: vehicleInfo.make,
              model: vehicleInfo.model,
              year: vehicleInfo.year,
              color: vehicleInfo.color || 'Unknown',
              plate: vehicleInfo.plate,
            },
          };

          const result = await createCheckout(checkoutData);
          if (result.clientSecret) {
            setStripeData({
              clientSecret: result.clientSecret,
              subscriptionId: result.subscriptionId,
            });
          } else {
            setError('Failed to get payment client secret');
          }
        } catch (err) {
          console.error('Error creating checkout:', err);
          setError('Failed to initialize payment. Please try again.');
        }

        setIsLoading(false);
      }
    }

    initializePayment();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => router.push('/checkout/vehicle')}
            className="bg-brand text-white px-4 py-2 rounded-lg mr-2"
          >
            Back to Vehicle Info
          </button>
          <button
            onClick={() => window.location.reload()}
            className="border border-brand text-brand px-4 py-2 rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!planData || !stripeData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Payment session not available</p>
          <button
            onClick={() => router.push('/')}
            className="bg-brand text-white px-4 py-2 rounded-lg"
          >
            Select Plan
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-32">

      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-lg md:text-2xl font-bold text-gray-900 mb-4 md:mb-8">
          Payment Information
        </h1>
        
        {/* Full-width payment form - no sidebar since plan info is in persistent bar */}
        <div className="bg-white rounded-lg shadow-md p-4 md:p-8">
          <StripeProvider clientSecret={stripeData.clientSecret}>
            <StripePaymentForm 
              planName={planData.plan} 
              period={planData.period as 'monthly' | 'yearly'}
              subscriptionId={stripeData.subscriptionId}
            />
          </StripeProvider>
        </div>
      </div>

      {/* Persistent Plan Bar */}
      <PersistentPlanBar 
        activePlan={planData.activePlan}
        billingPeriod={planData.billingPeriod}
        currentStep="payment"
        continueText="Complete Payment"
        showContinueButton={false} // Payment form has its own submit button
      />
    </div>
  );
} 