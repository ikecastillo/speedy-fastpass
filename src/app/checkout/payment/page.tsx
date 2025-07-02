"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

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
    <div className="min-h-screen bg-white pb-32">
      {/* Hero section matching home page style */}
      <div className="fixed inset-x-0 top-0 h-48 md:h-64 z-0 overflow-hidden">
        <Image 
          src="/SpeedyAtDay.PNG" 
          alt="Speedy Wash exterior" 
          fill 
          className="object-cover" 
          priority 
          sizes="100vw" 
        />
        
        {/* Location Badge Overlay */}
        <div className="absolute top-4 right-4 z-10">
          <div className="bg-white/20 backdrop-blur-md rounded-full px-3 py-2 shadow-sm border border-white/30">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-semibold text-white drop-shadow-sm">Round Rock, Texas</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main content with header matching home page */}
      <div className="relative z-10 pt-48 md:pt-64">
        {/* Modern App-Style Header */}
        <div className="relative -mt-5 z-10">
          <div 
            className="bg-white md:mx-8 pt-8 pb-6 px-6"
            style={{
              backgroundColor: '#ffffff',
              borderTopLeftRadius: '2rem',
              borderTopRightRadius: '2rem',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
            }}
          >
            {/* Header Content */}
            <div className="text-center mb-6">
              {/* Main Brand Logo */}
              <div className="flex items-start justify-center gap-1 mb-4">
                <h1 
                  className="text-2xl sm:text-3xl font-bold uppercase tracking-tight italic"
                  style={{ 
                    color: '#0B2545',
                    letterSpacing: '-0.02em'
                  }}
                >
                  Speedy
                </h1>
                <h1 
                  className="text-2xl sm:text-3xl font-bold uppercase tracking-tight"
                  style={{ 
                    color: '#0B2545',
                    letterSpacing: '-0.02em'
                  }}
                >
                  Wash
                </h1>
                <span 
                  className="text-lg font-bold"
                  style={{ 
                    color: '#FFD60A',
                    marginTop: '-4px',
                    marginLeft: '2px'
                  }}
                >
                  +
                </span>
              </div>
              
              {/* CTA Section */}
              <div 
                className="inline-block px-6 py-3 rounded-2xl mb-2"
                style={{
                  background: 'linear-gradient(135deg, #0B2545 0%, #1463B4 100%)',
                  boxShadow: '0 4px 16px rgba(11, 37, 69, 0.15)',
                }}
              >
                <h2 className="text-lg font-bold text-white mb-1">
                  Complete Your Payment
                </h2>
                <p className="text-sm text-blue-100 opacity-90">
                  Secure checkout powered by Stripe
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Pure white content area for payment form */}
        <div style={{ backgroundColor: '#ffffff' }}>
          {/* Payment form container */}
          <div className="px-4 md:px-8 pb-8">
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 md:p-8">
                <StripeProvider clientSecret={stripeData.clientSecret}>
                  <StripePaymentForm 
                    planName={planData.plan} 
                    period={planData.period as 'monthly' | 'yearly'}
                    subscriptionId={stripeData.subscriptionId}
                  />
                </StripeProvider>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Persistent Plan Bar */}
      <PersistentPlanBar 
        activePlan={planData.activePlan}
        billingPeriod={planData.billingPeriod}
        currentStep="payment"
        continueText="Complete Payment"
        showContinueButton={false} // Payment form has its own submit button
        showBackButton={true}
        onBack={() => {
          // Navigate back to vehicle page
          router.push('/checkout/vehicle');
        }}
      />
    </div>
  );
} 