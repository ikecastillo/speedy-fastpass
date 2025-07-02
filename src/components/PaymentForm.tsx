"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { number as validateCard } from 'card-validator';
import { CardIcon } from '@/components/ui/CardIcon';

const paymentSchema = z.object({
  nameOnCard: z.string().min(2, "Name on card must be at least 2 characters"),
  cardNumber: z.string()
    .transform(val => val.replace(/\s/g, ""))
    .refine(val => /^\d{16}$/.test(val), "Card number must be 16 digits"),
  expiry: z.string()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Expiry must be MM/YY format"),
  cvc: z.string()
    .regex(/^\d{3,4}$/, "CVC must be 3 or 4 digits")
});

type PaymentForm = z.infer<typeof paymentSchema>;

interface PaymentFormComponentProps {
  planName: string;
  period: 'monthly' | 'yearly';
}

export function PaymentFormComponent({ planName, period }: PaymentFormComponentProps) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [cardType, setCardType] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    trigger
  } = useForm<PaymentForm>({
    resolver: zodResolver(paymentSchema),
    mode: "onChange",
    defaultValues: {
      nameOnCard: "",
      cardNumber: "",
      expiry: "",
      cvc: ""
    }
  });

  // Format card number with spaces
  const cardNumberValue = watch("cardNumber");
  React.useEffect(() => {
    if (cardNumberValue) {
      const formatted = cardNumberValue
        .replace(/\s/g, "")
        .replace(/(.{4})/g, "$1 ")
        .trim()
        .slice(0, 19); // 16 digits + 3 spaces
      if (formatted !== cardNumberValue) {
        setValue("cardNumber", formatted, { shouldValidate: true });
      }
    }
  }, [cardNumberValue, setValue]);

  // Format expiry with slash
  const expiryValue = watch("expiry");
  React.useEffect(() => {
    if (expiryValue) {
      const cleaned = expiryValue.replace(/\D/g, "");
      let formatted = cleaned;
      if (cleaned.length >= 2) {
        formatted = cleaned.slice(0, 2) + "/" + cleaned.slice(2, 4);
      }
      if (formatted !== expiryValue) {
        setValue("expiry", formatted, { shouldValidate: true });
      }
    }
  }, [expiryValue, setValue]);

  const handleSimulate = async () => {
    const simulateData = {
      nameOnCard: "John Doe",
      cardNumber: "4242424242424242",
      expiry: "12/26",
      cvc: "123"
    };

    // Set all values
    Object.entries(simulateData).forEach(([key, value]) => {
      setValue(key as keyof PaymentForm, value, { shouldValidate: true, shouldDirty: true });
    });

    // Trigger validation for all fields
    await trigger();
  };

  const onSubmit = async (data: PaymentForm) => {
    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store payment success for success page
      if (typeof window !== 'undefined') {
        localStorage.setItem('paymentSuccess', JSON.stringify({
          cardLast4: data.cardNumber.slice(-4),
          timestamp: new Date().toISOString(),
          planName,
          period
        }));
      }
      
      // Navigate to success page
      router.push('/checkout/success');
    } catch (error) {
      console.error('Payment processing error:', error);
      setIsProcessing(false);
    }
  };

  const handleBack = () => {
    router.push('/checkout/vehicle');
  };

  return (
    <div className="bg-white">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Payment Information
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Name on Card */}
        <div>
          <label htmlFor="nameOnCard" className="block text-sm font-medium text-gray-700 mb-2">
            Name on Card
          </label>
          <Input
            {...register("nameOnCard")}
            type="text"
            id="nameOnCard"
            autoComplete="cc-name"
            aria-invalid={errors.nameOnCard ? "true" : "false"}
            className={errors.nameOnCard ? "border-red-500" : ""}
            placeholder="John Doe"
            disabled={isProcessing}
          />
          {errors.nameOnCard && (
                          <p className="mt-1 text-sm text-red-600" role="alert" aria-live="polite">
                {errors.nameOnCard.message}
              </p>
          )}
        </div>

        {/* Card Number */}
        <div>
          <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-2">
            Card Number
          </label>
          <div className="relative">
            <Input
              {...register("cardNumber")}
              type="text"
              id="cardNumber"
              autoComplete="cc-number"
              aria-invalid={errors.cardNumber ? "true" : "false"}
              className={errors.cardNumber ? "border-red-500 pr-12" : "pr-12"}
              placeholder="4242 4242 4242 4242"
              maxLength={19}
              disabled={isProcessing}
              onChange={(e) => {
                const value = e.target.value;
                const validation = validateCard(value);
                setCardType(validation.card?.type || null);
              }}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
              <CardIcon type={cardType} />
            </div>
          </div>
          {errors.cardNumber && (
            <p className="mt-1 text-sm text-red-600" role="alert">
              {errors.cardNumber.message}
            </p>
          )}
        </div>

        {/* Expiry and CVC */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="expiry" className="block text-sm font-medium text-gray-700 mb-2">
              Expiry Date
            </label>
            <Input
              {...register("expiry")}
              type="text"
              id="expiry"
              autoComplete="cc-exp"
              aria-invalid={errors.expiry ? "true" : "false"}
              className={errors.expiry ? "border-red-500" : ""}
              placeholder="MM/YY"
              maxLength={5}
              disabled={isProcessing}
            />
            {errors.expiry && (
              <p className="mt-1 text-sm text-red-600" role="alert">
                {errors.expiry.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="cvc" className="block text-sm font-medium text-gray-700 mb-2">
              CVC
            </label>
            <Input
              {...register("cvc")}
              type="text"
              id="cvc"
              autoComplete="cc-csc"
              aria-invalid={errors.cvc ? "true" : "false"}
              className={errors.cvc ? "border-red-500" : ""}
              placeholder="123"
              maxLength={4}
              disabled={isProcessing}
            />
            {errors.cvc && (
              <p className="mt-1 text-sm text-red-600" role="alert">
                {errors.cvc.message}
              </p>
            )}
          </div>
        </div>

        {/* Processing Status */}
        {isProcessing && (
          <div className="flex items-center gap-2 text-brand" role="status" aria-live="polite">
            <div className="w-4 h-4 border-2 border-brand border-t-transparent rounded-full animate-spin"></div>
            <span>Processing payment...</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6">
          {/* Auto-fill Button */}
          <button
            type="button"
            onClick={handleSimulate}
            disabled={isProcessing}
            className="px-6 py-3 bg-accent text-gray-800 rounded-lg font-medium hover:bg-yellow-500 transition-colors border border-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            💳 Auto-fill Test Card
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
            disabled={isProcessing}
            className={`
              flex-1 px-8 py-3 rounded-lg font-medium transition-colors
              ${
                isProcessing
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
              "Process Payment"
            )}
          </button>
        </div>
      </form>
    </div>
  );
} 