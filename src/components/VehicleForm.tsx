"use client";

import React from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { vehicleSchema, type VehicleForm, US_STATES } from "@/types/vehicle";

export function VehicleFormComponent() {
  const router = useRouter();
  const [planData, setPlanData] = React.useState<{plan: string; period: string; price: number} | null>(null);
  const [selectedImage, setSelectedImage] = React.useState<File | null>(null);
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);
  
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

  // Watch phone field to format as (###) ###-####
  const phoneValue = watch("phone");
  React.useEffect(() => {
    if (phoneValue) {
      const numericOnly = phoneValue.replace(/\D/g, "");
      let formatted = numericOnly;
      
      if (numericOnly.length >= 6) {
        formatted = `(${numericOnly.slice(0, 3)}) ${numericOnly.slice(3, 6)}-${numericOnly.slice(6, 10)}`;
      } else if (numericOnly.length >= 3) {
        formatted = `(${numericOnly.slice(0, 3)}) ${numericOnly.slice(3)}`;
      } else if (numericOnly.length > 0) {
        formatted = numericOnly;
      }
      
      if (formatted !== phoneValue) {
        setValue("phone", formatted, { shouldValidate: true });
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

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Show toast notification
      setTimeout(() => {
        alert('Scan coming soon! For now, we\'re just showing your selected image.');
      }, 500);
    }
  };

  const handleSimulate = async () => {
    const simulateData = {
      firstName: "Jane",
      lastName: "Doe", 
      email: "jane@example.com",
      phone: "(555) 123-4567",
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
    router.push('/');
  };

  const isNextDisabled = !isValid || !isDirty;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Personal Information Section */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </div>
          Personal Information
        </h2>
        <div className="space-y-4">
          {/* First and Last Name - Side by side */}
          <div className="grid grid-cols-2 gap-4">
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
                  w-full px-4 py-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-[16px] transition-all
                  ${errors.firstName ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-gray-400"}
                `}
                placeholder="John"
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1" role="alert" aria-live="polite">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
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
                  w-full px-4 py-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-[16px] transition-all
                  ${errors.lastName ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-gray-400"}
                `}
                placeholder="Doe"
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1" role="alert" aria-live="polite">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          {/* Email and Phone - Side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  w-full px-4 py-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-[16px] transition-all
                  ${errors.email ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-gray-400"}
                `}
                placeholder="john@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1" role="alert" aria-live="polite">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
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
                  w-full px-4 py-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-[16px] transition-all
                  ${errors.phone ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-gray-400"}
                `}
                placeholder="(555) 123-4567"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1" role="alert">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.phone.message}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Vehicle Information Section */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-600 to-green-700 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a2 2 0 114 0 2 2 0 01-4 0zm8 0a2 2 0 114 0 2 2 0 01-4 0z" clipRule="evenodd" />
            </svg>
          </div>
          Vehicle Information
        </h2>
        <div className="space-y-4">
          {/* License Plate and State */}
          <div className="grid grid-cols-2 gap-4">
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
                  w-full px-4 py-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 uppercase text-[16px] transition-all font-mono
                  ${errors.plate ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-gray-400"}
                `}
                placeholder="ABC1234"
                maxLength={8}
              />
              {errors.plate && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1" role="alert">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
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
                  w-full px-4 py-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-[16px] transition-all
                  ${errors.state ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-gray-400"}
                `}
              >
                {US_STATES.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
              {errors.state && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1" role="alert">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.state.message}
                </p>
              )}
            </div>
          </div>

          {/* Make, Model and Year */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {/* Make */}
            <div>
              <label htmlFor="make" className="block text-sm font-medium text-gray-700 mb-2">
                Make
              </label>
              <input
                {...register("make")}
                type="text"
                id="make"
                aria-invalid={errors.make ? "true" : "false"}
                className={`
                  w-full px-4 py-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-[16px] transition-all
                  ${errors.make ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-gray-400"}
                `}
                placeholder="Toyota"
              />
              {errors.make && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1" role="alert">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.make.message}
                </p>
              )}
            </div>

            {/* Model */}
            <div>
              <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-2">
                Model
              </label>
              <input
                {...register("model")}
                type="text"
                id="model"
                aria-invalid={errors.model ? "true" : "false"}
                className={`
                  w-full px-4 py-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-[16px] transition-all
                  ${errors.model ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-gray-400"}
                `}
                placeholder="Camry"
              />
              {errors.model && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1" role="alert">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.model.message}
                </p>
              )}
            </div>

            {/* Year */}
            <div className="col-span-2 md:col-span-1">
              <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-2">
                Year
              </label>
              <input
                {...register("year")}
                type="text"
                id="year"
                aria-invalid={errors.year ? "true" : "false"}
                className={`
                  w-full px-4 py-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-[16px] transition-all
                  ${errors.year ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-gray-400"}
                `}
                placeholder="2022"
                maxLength={4}
              />
              {errors.year && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1" role="alert">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.year.message}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Terms of Service */}
      <div className="bg-gray-50 rounded-xl p-4">
        <div className="flex items-start space-x-3">
          <input
            {...register("agreeTos")}
            type="checkbox"
            id="agreeTos"
            aria-invalid={errors.agreeTos ? "true" : "false"}
            className="mt-1 h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="agreeTos" className="text-sm text-gray-700 leading-relaxed">
            I agree to the{" "}
            <a href="#" className="text-blue-600 underline hover:text-blue-800 font-medium">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-blue-600 underline hover:text-blue-800 font-medium">
              Privacy Policy
            </a>
          </label>
        </div>
        {errors.agreeTos && (
          <p className="mt-2 text-sm text-red-600 flex items-center gap-1" role="alert">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {errors.agreeTos.message}
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 pt-4">
        {/* Auto-fill Button */}
        <button
          type="button"
          onClick={handleSimulate}
          className="w-full px-4 py-3 bg-yellow-100 text-yellow-800 rounded-xl font-medium hover:bg-yellow-200 transition-colors border border-yellow-300 flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
          </svg>
          Auto-fill Demo Data
        </button>

        {/* Navigation Buttons Row */}
        <div className="flex gap-3">
          {/* Back Button */}
          <button
            type="button"
            onClick={handleBack}
            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Plans
          </button>

          {/* Next Button */}
          <button
            type="submit"
            disabled={isNextDisabled}
            className={`
              flex-1 px-4 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2
              ${
                isNextDisabled
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300"
                  : "text-white shadow-lg hover:shadow-xl"
              }
            `}
            style={!isNextDisabled ? {
              background: 'linear-gradient(135deg, #0B2545 0%, #1463B4 100%)',
              boxShadow: '0 4px 16px rgba(11, 37, 69, 0.15)'
            } : {}}
          >
            Continue
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </form>
  );
} 