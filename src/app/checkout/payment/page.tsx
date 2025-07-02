"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { StripeProvider } from "@/components/StripeProvider";
import { StripePaymentForm } from "@/components/StripePaymentForm";
import { PersistentPlanBar } from "@/components/PersistentPlanBar";
import { createCheckout, type CheckoutData } from "@/app/actions/createCheckout";
import { 
  getCheckoutData, 
  validateCheckoutData, 
  migrateOldCheckoutData,
  getPlanData 
} from "@/lib/checkout-data";

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
      console.log('🚀 Payment page: Starting initialization...');
      
      if (typeof window !== 'undefined') {
        // Migrate old data format if needed
        migrateOldCheckoutData();
        
        // Validate we have all required data
        const validation = validateCheckoutData();
        if (!validation.isValid) {
          console.log('❌ Missing required data:', validation.missingData);
          
          if (validation.missingData.includes('plan selection')) {
            console.log('➡️ Redirecting to home for plan selection');
            router.push('/');
            return;
          }
          
          if (validation.missingData.includes('vehicle information')) {
            console.log('➡️ Redirecting to vehicle form');
            router.push('/checkout/vehicle');
            return;
          }
          
          console.log('❌ Unknown missing data, redirecting to home');
          router.push('/');
          return;
        }

        // Get checkout data using new system
        const checkoutData = getCheckoutData();
        if (!checkoutData?.plan || !checkoutData?.vehicle) {
          console.log('❌ Checkout data incomplete, redirecting to home');
          router.push('/');
          return;
        }

        console.log('✅ Checkout data loaded:', checkoutData);

        // Get plan data for UI
        const planInfo = getPlanData();
        if (planInfo) {
          setPlanData({
            plan: checkoutData.plan.displayName,
            period: checkoutData.plan.period,
            activePlan: planInfo.activePlan,
            billingPeriod: planInfo.billingPeriod
          });
          
          console.log('📊 Plan data set for UI:', planInfo);
        }

        // Create Stripe checkout session
        try {
          console.log('💳 Creating Stripe checkout session...');
          
          const stripeCheckoutData: CheckoutData = {
            plan: checkoutData.plan.name,
            period: checkoutData.plan.period,
            customerInfo: {
              email: checkoutData.vehicle.email,
              firstName: checkoutData.vehicle.firstName,
              lastName: checkoutData.vehicle.lastName,
              phone: checkoutData.vehicle.phone,
            },
            vehicleInfo: {
              make: checkoutData.vehicle.make,
              model: checkoutData.vehicle.model,
              year: checkoutData.vehicle.year,
              color: 'Unknown', // Vehicle form doesn't collect color
              plate: checkoutData.vehicle.plate,
            },
          };

          console.log('📤 Sending checkout data:', stripeCheckoutData);
          
          const result = await createCheckout(stripeCheckoutData);
          
          console.log('📥 Received checkout result:', result);
          
          if (result.clientSecret) {
            console.log('✅ Successfully got client secret');
            setStripeData({
              clientSecret: result.clientSecret,
              subscriptionId: result.subscriptionId,
            });
          } else {
            console.log('❌ No client secret in result');
            setError('Failed to get payment client secret');
          }
        } catch (err) {
          console.error('💥 Error creating checkout:', err);
          console.error('Error details:', {
            message: err instanceof Error ? err.message : 'Unknown error',
            stack: err instanceof Error ? err.stack : undefined,
            type: typeof err
          });
          setError(`Failed to initialize payment: ${err instanceof Error ? err.message : 'Unknown error'}`);
        }

        console.log('🏁 Payment initialization complete, setting loading to false');
        setIsLoading(false);
      }
    }

    initializePayment();
  }, [router]);

  if (isLoading) {
    console.log('⏳ Payment page in loading state');
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 border-4 border-brand border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Initializing Payment</h2>
          <p className="text-gray-600 mb-4">Setting up your secure checkout...</p>
          
          <div className="text-xs text-gray-500 p-3 bg-gray-100 rounded-lg">
            <p className="font-medium mb-2">Progress:</p>
            <p>• Validating your information ✓</p>
            <p>• Creating secure payment session...</p>
            <p>• Loading payment form...</p>
          </div>
          
          <div className="mt-6">
            <p className="text-xs text-gray-400">
              This usually takes just a few seconds
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    console.log('💔 Payment page error state:', error);
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Payment Initialization Error</h2>
            <p className="text-red-600 mb-4 text-sm">{error}</p>
            <div className="text-xs text-gray-500 mb-6 p-3 bg-gray-100 rounded-lg">
              <p className="font-medium mb-2">Debug Information:</p>
              <p>• Check browser console for detailed logs</p>
              <p>• Ensure you completed the vehicle form</p>
              <p>• Try refreshing the page</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={() => {
                console.log('🔄 User clicked "Try Again"');
                window.location.reload();
              }}
              className="w-full bg-brand text-white px-4 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => {
                console.log('🔙 User clicked "Back to Vehicle Info"');
                router.push('/checkout/vehicle');
              }}
              className="w-full border border-gray-300 text-gray-700 px-4 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Back to Vehicle Info
            </button>
            <button
              onClick={() => {
                console.log('🏠 User clicked "Start Over"');
                router.push('/');
              }}
              className="w-full text-gray-500 px-4 py-2 rounded-lg font-medium hover:text-gray-700 transition-colors"
            >
              Start Over
            </button>
          </div>
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
                 className="inline-block px-8 py-3 rounded-2xl mb-3 max-w-sm mx-auto"
                 style={{
                   background: 'linear-gradient(135deg, #0B2545 0%, #1463B4 100%)',
                   boxShadow: '0 4px 16px rgba(11, 37, 69, 0.15)',
                   width: '100%'
                 }}
               >
                 <h2 className="text-lg sm:text-xl font-bold text-white mb-1">
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