"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SuccessConfetti from "@/components/SuccessConfetti";
import { OrderSummary } from "@/components/OrderSummary";
import { Stepper } from "@/components/Stepper";
import { confirmPayment } from "@/app/actions/createCheckout";

interface VehicleData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  plate: string;
  state: string;
  make: string;
  model: string;
  year: string;
  agreeTos: boolean;
}

interface PaymentSuccessData {
  cardLast4: string;
  timestamp: string;
  planName: string;
  period: 'monthly' | 'yearly';
  subscriptionId?: string;
}

function SuccessPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [paymentData, setPaymentData] = useState<PaymentSuccessData | null>(null);
  const [vehicleData, setVehicleData] = useState<VehicleData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSuccessData() {
      if (typeof window !== 'undefined') {
        // Get subscription ID from URL params
        const subscriptionId = searchParams.get('subscription_id');
        
        // Get vehicle form data
        const vehicleFormData = localStorage.getItem('vehicleFormData');
        if (vehicleFormData) {
          setVehicleData(JSON.parse(vehicleFormData));
        }

        // Try to get Stripe payment data first
        if (subscriptionId) {
          try {
            const result = await confirmPayment(subscriptionId);
                         if (result.success && result.paymentMethod && result.subscription) {
               const cardLast4 = result.paymentMethod.card?.last4 || '';
               const planName = result.subscription.metadata?.plan || 'Unknown';
               const period = result.subscription.metadata?.period || 'monthly';
              
              setPaymentData({
                cardLast4: cardLast4 || '0000', // Fallback if no card data
                timestamp: new Date().toISOString(),
                planName,
                period: period as 'monthly' | 'yearly',
                subscriptionId,
              });
            }
          } catch (error) {
            console.error('Error confirming payment:', error);
          }
        }

        // Fallback: try to get from localStorage (for backward compatibility)
        if (!paymentData) {
          const paymentSuccessData = localStorage.getItem('paymentSuccess');
          if (paymentSuccessData) {
            setPaymentData(JSON.parse(paymentSuccessData));
          }
        }

        setLoading(false);
      }
    }

    loadSuccessData();
  }, [searchParams, paymentData]);

  const handleBackToHome = () => {
    // Clear all localStorage data
    if (typeof window !== 'undefined') {
      localStorage.removeItem('selectedPlan');
      localStorage.removeItem('vehicleFormData');
      localStorage.removeItem('paymentSuccess');
      localStorage.removeItem('checkoutPlan');
    }
    
    // Navigate to plan selection with reset flag
            router.push('/?reset=1');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!paymentData || !vehicleData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Oops! Something went wrong
          </h1>
          <p className="text-gray-600 mb-6">
            We couldn&apos;t find your order information. Please try again.
          </p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-brand text-white rounded-lg font-medium hover:bg-blue-900 transition-colors"
          >
            Start Over
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Full-viewport confetti */}
      <SuccessConfetti />
      
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          {/* Stepper */}
          <div className="mb-8">
            <Stepper currentStep={4} />
          </div>

          {/* Success Content */}
          <div className="max-w-lg mx-auto text-center space-y-8">
            {/* Success Message */}
            <div className="bg-white rounded-lg shadow-md p-8" role="status">
              <div className="mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Thanks, {vehicleData.firstName}!
                </h1>
                <p className="text-lg text-gray-600">
                  Your {paymentData.planName} membership is now active.
                </p>
              </div>
            </div>

            {/* Order Summary */}
            <OrderSummary
              planName={paymentData.planName}
              period={paymentData.period}
              vehicleData={vehicleData}
              paymentData={paymentData}
            />

            {/* Navigation Buttons */}
            <div className="space-y-4">
              {/* Manage Membership - Secondary */}
              <a
                href="#"
                className="block w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Manage Membership
              </a>

              {/* Back to Home - Primary */}
              <button
                onClick={handleBackToHome}
                className="w-full px-6 py-3 bg-brand text-white rounded-lg font-medium hover:bg-blue-900 transition-colors"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <SuccessPageContent />
    </Suspense>
  );
} 