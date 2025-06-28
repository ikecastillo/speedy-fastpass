"use client";

import React from "react";
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useRouter } from "next/navigation";

interface StripePaymentFormProps {
  planName: string;
  period: 'monthly' | 'yearly';
  subscriptionId: string;
}

export function StripePaymentForm({ planName, period, subscriptionId }: StripePaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/success?subscription_id=${subscriptionId}`,
        },
        redirect: 'if_required',
      });

      if (error) {
        setErrorMessage(error.message || 'An unexpected error occurred.');
        setIsProcessing(false);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Store payment success for success page
        if (typeof window !== 'undefined') {
          localStorage.setItem('paymentSuccess', JSON.stringify({
            subscriptionId,
            timestamp: new Date().toISOString(),
            planName,
            period
          }));
        }
        
        router.push(`/checkout/success?subscription_id=${subscriptionId}`);
      }
    } catch (err) {
      console.error('Payment error:', err);
      setErrorMessage('An unexpected error occurred.');
      setIsProcessing(false);
    }
  };

  const handleBack = () => {
    router.push('/checkout/vehicle');
  };

  const handleTestCard = () => {
    // This will be handled by Stripe's test environment
    setErrorMessage('Use test card 4242 4242 4242 4242 with any future expiry and CVC to test.');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Payment Information
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Stripe Payment Element */}
        <div className="p-4 border border-gray-200 rounded-lg">
          <PaymentElement 
            options={{
              layout: 'tabs',
              fields: {
                billingDetails: {
                  name: 'auto',
                  email: 'auto',
                },
              },
            }}
          />
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{errorMessage}</p>
          </div>
        )}

        {/* Processing Status */}
        {isProcessing && (
          <div className="flex items-center gap-2 text-brand" role="status" aria-live="polite">
            <div className="w-4 h-4 border-2 border-brand border-t-transparent rounded-full animate-spin"></div>
            <span>Processing payment...</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6">
          {/* Test Card Button */}
          <button
            type="button"
            onClick={handleTestCard}
            disabled={isProcessing}
            className="px-6 py-3 bg-accent text-gray-800 rounded-lg font-medium hover:bg-yellow-500 transition-colors border border-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            💳 Test Card Info
          </button>

          <button
            type="button"
            onClick={handleBack}
            disabled={isProcessing}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Back
          </button>

          <button
            type="submit"
            disabled={!stripe || isProcessing}
            className={`
              flex-1 px-8 py-3 rounded-lg font-medium transition-colors
              ${
                !stripe || isProcessing
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-brand text-white hover:bg-blue-900"
              }
            `}
          >
            {isProcessing ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Processing...
              </span>
            ) : (
              "Complete Payment"
            )}
          </button>
        </div>
      </form>
    </div>
  );
} 