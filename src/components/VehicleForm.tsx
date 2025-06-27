"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { vehicleSchema, type VehicleForm, US_STATES } from "@/types/vehicle";

export function VehicleFormComponent() {
  const router = useRouter();
  const [planData, setPlanData] = React.useState<{plan: string; period: string; price: number} | null>(null);
  
  // Read plan data from localStorage
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedPlan = localStorage.getItem('selectedPlan');
      if (storedPlan) {
        setPlanData(JSON.parse(storedPlan));
      }
    }
  }, []);
  
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid, isDirty },
    trigger,
    watch
  } = useForm<VehicleForm>({
    resolver: zodResolver(vehicleSchema),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      plate: "",
      state: "CA",
      make: "",
      model: "",
      year: "",
      agreeTos: false
    }
  });

  // Watch phone field to strip non-numeric characters
  const phoneValue = watch("phone");
  React.useEffect(() => {
    if (phoneValue) {
      const numericOnly = phoneValue.replace(/\D/g, "");
      if (numericOnly !== phoneValue) {
        setValue("phone", numericOnly, { shouldValidate: true });
      }
    }
  }, [phoneValue, setValue]);

  // Watch plate field to uppercase
  const plateValue = watch("plate");
  React.useEffect(() => {
    if (plateValue) {
      const upperCase = plateValue.toUpperCase();
      if (upperCase !== plateValue) {
        setValue("plate", upperCase, { shouldValidate: true });
      }
    }
  }, [plateValue, setValue]);

  const handleSimulate = async () => {
    const simulateData = {
      firstName: "Jane",
      lastName: "Doe", 
      email: "jane@example.com",
      phone: "5551234567",
      plate: "ABC1234",
      state: "TX" as const,
      make: "Toyota",
      model: "Camry",
      year: "2022",
      agreeTos: true
    };

    // Set all values
    Object.entries(simulateData).forEach(([key, value]) => {
      setValue(key as keyof VehicleForm, value, { shouldValidate: true, shouldDirty: true });
    });

    // Trigger validation for all fields
    await trigger();
  };

  const onSubmit = (data: VehicleForm) => {
    // Store both plan and form data in localStorage for payment page
    if (typeof window !== 'undefined') {
      const planInfo = {
        plan: planData?.plan || "deluxe",
        period: planData?.period || "monthly",
        price: planData?.price || 24.99
      };
      localStorage.setItem('vehicleFormData', JSON.stringify(data));
      localStorage.setItem('checkoutPlan', JSON.stringify(planInfo));
    }
    
    // Navigate to payment
    router.push('/checkout/payment');
  };

  const handleBack = () => {
    router.push('/plan');
  };

  const isNextDisabled = !isValid || !isDirty;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Personal Information Section */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Personal Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* First Name */}
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
              First Name
            </label>
            <input
              {...register("firstName")}
              type="text"
              id="firstName"
              aria-invalid={errors.firstName ? "true" : "false"}
              className={`
                w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand
                ${errors.firstName ? "border-red-500" : "border-gray-300"}
              `}
              placeholder="Enter your first name"
            />
            {errors.firstName && (
              <p className="mt-1 text-sm text-red-600" role="alert" aria-live="polite">
                {errors.firstName.message}
              </p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
              Last Name
            </label>
            <input
              {...register("lastName")}
              type="text"
              id="lastName"
              aria-invalid={errors.lastName ? "true" : "false"}
              className={`
                w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand
                ${errors.lastName ? "border-red-500" : "border-gray-300"}
              `}
              placeholder="Enter your last name"
            />
            {errors.lastName && (
              <p className="mt-1 text-sm text-red-600" role="alert" aria-live="polite">
                {errors.lastName.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              {...register("email")}
              type="email"
              id="email"
              aria-invalid={errors.email ? "true" : "false"}
              className={`
                w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand
                ${errors.email ? "border-red-500" : "border-gray-300"}
              `}
              placeholder="Enter your email address"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600" role="alert" aria-live="polite">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              {...register("phone")}
              type="tel"
              id="phone"
              aria-invalid={errors.phone ? "true" : "false"}
              className={`
                w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand
                ${errors.phone ? "border-red-500" : "border-gray-300"}
              `}
              placeholder="5551234567"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600" role="alert">
                {errors.phone.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Vehicle Information Section */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Vehicle Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* License Plate */}
          <div>
            <label htmlFor="plate" className="block text-sm font-medium text-gray-700 mb-2">
              License Plate
            </label>
            <input
              {...register("plate")}
              type="text"
              id="plate"
              aria-invalid={errors.plate ? "true" : "false"}
              className={`
                w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand uppercase
                ${errors.plate ? "border-red-500" : "border-gray-300"}
              `}
              placeholder="ABC1234"
              maxLength={8}
            />
            {errors.plate && (
              <p className="mt-1 text-sm text-red-600" role="alert">
                {errors.plate.message}
              </p>
            )}
          </div>

          {/* State */}
          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
              State
            </label>
            <select
              {...register("state")}
              id="state"
              aria-invalid={errors.state ? "true" : "false"}
              className={`
                w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand
                ${errors.state ? "border-red-500" : "border-gray-300"}
              `}
            >
              {US_STATES.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
            {errors.state && (
              <p className="mt-1 text-sm text-red-600" role="alert">
                {errors.state.message}
              </p>
            )}
          </div>

          {/* Make */}
          <div>
            <label htmlFor="make" className="block text-sm font-medium text-gray-700 mb-2">
              Vehicle Make
            </label>
            <input
              {...register("make")}
              type="text"
              id="make"
              aria-invalid={errors.make ? "true" : "false"}
              className={`
                w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand
                ${errors.make ? "border-red-500" : "border-gray-300"}
              `}
              placeholder="Toyota"
            />
            {errors.make && (
              <p className="mt-1 text-sm text-red-600" role="alert">
                {errors.make.message}
              </p>
            )}
          </div>

          {/* Model */}
          <div>
            <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-2">
              Vehicle Model
            </label>
            <input
              {...register("model")}
              type="text"
              id="model"
              aria-invalid={errors.model ? "true" : "false"}
              className={`
                w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand
                ${errors.model ? "border-red-500" : "border-gray-300"}
              `}
              placeholder="Camry"
            />
            {errors.model && (
              <p className="mt-1 text-sm text-red-600" role="alert">
                {errors.model.message}
              </p>
            )}
          </div>

          {/* Year */}
          <div className="md:col-span-2">
            <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-2">
              Vehicle Year
            </label>
            <input
              {...register("year")}
              type="text"
              id="year"
              aria-invalid={errors.year ? "true" : "false"}
              className={`
                w-full md:w-32 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand
                ${errors.year ? "border-red-500" : "border-gray-300"}
              `}
              placeholder="2022"
              maxLength={4}
            />
            {errors.year && (
              <p className="mt-1 text-sm text-red-600" role="alert">
                {errors.year.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Terms of Service */}
      <div>
        <div className="flex items-start space-x-3">
          <input
            {...register("agreeTos")}
            type="checkbox"
            id="agreeTos"
            aria-invalid={errors.agreeTos ? "true" : "false"}
            className="mt-1 h-4 w-4 text-brand focus:ring-brand border-gray-300 rounded"
          />
          <label htmlFor="agreeTos" className="text-sm text-gray-700">
            I agree to the{" "}
            <a href="#" className="text-brand underline hover:text-blue-700">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-brand underline hover:text-blue-700">
              Privacy Policy
            </a>
          </label>
        </div>
        {errors.agreeTos && (
          <p className="mt-1 text-sm text-red-600" role="alert">
            {errors.agreeTos.message}
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 pt-6">
        {/* Simulate Button (Dev Only) */}
        {process.env.NODE_ENV !== "production" && (
          <button
            type="button"
            onClick={handleSimulate}
            className="px-6 py-3 bg-slate-200 text-slate-800 rounded-lg font-medium hover:bg-slate-300 transition-colors"
          >
            Simulate
          </button>
        )}

        {/* Back Button */}
        <button
          type="button"
          onClick={handleBack}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
        >
          Back to Plans
        </button>

        {/* Next Button */}
        <button
          type="submit"
          disabled={isNextDisabled}
          className={`
            px-8 py-3 rounded-lg font-medium transition-colors flex-1 sm:flex-none
            ${
              isNextDisabled
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-brand text-white hover:bg-blue-700"
            }
          `}
        >
          Next
        </button>
      </div>
    </form>
  );
} 