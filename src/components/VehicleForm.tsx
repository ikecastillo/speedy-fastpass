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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
      {/* Personal Information Section */}
      <div>
        <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-3 md:mb-4">Personal Information</h2>
        <div className="space-y-3 md:space-y-4">
          {/* First Name */}
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">
              First Name
            </label>
            <input
              {...register("firstName")}
              type="text"
              id="firstName"
              aria-invalid={errors.firstName ? "true" : "false"}
              className={`
                w-full px-3 py-3 md:py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand text-base md:text-sm
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
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">
              Last Name
            </label>
            <input
              {...register("lastName")}
              type="text"
              id="lastName"
              aria-invalid={errors.lastName ? "true" : "false"}
              className={`
                w-full px-3 py-3 md:py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand text-base md:text-sm
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
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">
              Email Address
            </label>
            <input
              {...register("email")}
              type="email"
              id="email"
              aria-invalid={errors.email ? "true" : "false"}
              className={`
                w-full px-3 py-3 md:py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand text-base md:text-sm
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
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">
              Phone Number
            </label>
            <input
              {...register("phone")}
              type="tel"
              id="phone"
              aria-invalid={errors.phone ? "true" : "false"}
              className={`
                w-full px-3 py-3 md:py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand text-base md:text-sm
                ${errors.phone ? "border-red-500" : "border-gray-300"}
              `}
              placeholder="(555) 123-4567"
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
        <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-3 md:mb-4">Vehicle Information</h2>
        <div className="space-y-3 md:space-y-4">
          {/* License Plate */}
          <div>
            <label htmlFor="plate" className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">
              License Plate
            </label>
            <input
              {...register("plate")}
              type="text"
              id="plate"
              aria-invalid={errors.plate ? "true" : "false"}
              className={`
                w-full px-3 py-3 md:py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand uppercase text-base md:text-sm
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
            <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">
              State
            </label>
            <select
              {...register("state")}
              id="state"
              aria-invalid={errors.state ? "true" : "false"}
              className={`
                w-full px-3 py-3 md:py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand text-base md:text-sm
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
            <label htmlFor="make" className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">
              Vehicle Make
            </label>
            <input
              {...register("make")}
              type="text"
              id="make"
              aria-invalid={errors.make ? "true" : "false"}
              className={`
                w-full px-3 py-3 md:py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand text-base md:text-sm
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
            <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">
              Vehicle Model
            </label>
            <input
              {...register("model")}
              type="text"
              id="model"
              aria-invalid={errors.model ? "true" : "false"}
              className={`
                w-full px-3 py-3 md:py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand text-base md:text-sm
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
          <div>
            <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">
              Vehicle Year
            </label>
            <input
              {...register("year")}
              type="text"
              id="year"
              aria-invalid={errors.year ? "true" : "false"}
              className={`
                w-full px-3 py-3 md:py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand text-base md:text-sm
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

          {/* Insurance Card Scanner (Beta) */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 md:p-4 bg-blue-50">
            <div className="text-center">
              <h3 className="text-base md:text-lg font-medium text-gray-900 mb-1 md:mb-2">
                📱 Scan Insurance Card (Beta)
              </h3>
              <p className="text-xs md:text-sm text-gray-600 mb-3 md:mb-4">
                Upload a photo of your insurance card for faster setup
              </p>
              
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleImageChange}
                className="hidden"
                id="insurance-upload"
              />
              
              <label
                htmlFor="insurance-upload"
                className="cursor-pointer inline-flex items-center px-3 py-2 md:px-4 border border-brand text-brand rounded-lg hover:bg-brand hover:text-white transition-colors text-sm md:text-base"
              >
                📷 Take Photo
              </label>

              {imagePreview && (
                <div className="mt-3 md:mt-4">
                  <p className="text-xs md:text-sm text-gray-600 mb-2">Selected image:</p>
                  <Image
                    src={imagePreview}
                    alt="Insurance card preview"
                    width={144}
                    height={96}
                    className="mx-auto max-w-36 max-h-24 md:max-w-48 md:max-h-32 object-cover rounded border"
                  />
                  <p className="text-xs text-gray-500 mt-1 md:mt-2">
                    {selectedImage?.name}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Terms of Service */}
      <div>
        <div className="flex items-start space-x-2 md:space-x-3">
          <input
            {...register("agreeTos")}
            type="checkbox"
            id="agreeTos"
            aria-invalid={errors.agreeTos ? "true" : "false"}
            className="mt-0.5 md:mt-1 h-4 w-4 md:h-5 md:w-5 text-brand focus:ring-brand border-gray-300 rounded"
          />
          <label htmlFor="agreeTos" className="text-xs md:text-sm text-gray-700">
            I agree to the{" "}
            <a href="#" className="text-brand underline hover:text-blue-900">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-brand underline hover:text-blue-900">
              Privacy Policy
            </a>
          </label>
        </div>
        {errors.agreeTos && (
          <p className="mt-1 text-xs md:text-sm text-red-600" role="alert">
            {errors.agreeTos.message}
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 pt-4 md:pt-6">
        {/* Auto-fill Button */}
        <button
          type="button"
          onClick={handleSimulate}
          className="w-full px-4 py-3 bg-accent text-gray-800 rounded-lg font-medium hover:bg-yellow-500 transition-colors border border-yellow-600 text-sm md:text-base"
        >
          🚀 Auto-fill Demo Data
        </button>

        {/* Navigation Buttons Row */}
        <div className="flex gap-3">
          {/* Back Button */}
          <button
            type="button"
            onClick={handleBack}
            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm md:text-base"
          >
            Back to Plans
          </button>

          {/* Next Button */}
          <button
            type="submit"
            disabled={isNextDisabled}
            className={`
              flex-1 px-4 py-3 rounded-lg font-medium transition-colors text-sm md:text-base
              ${
                isNextDisabled
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-brand text-white hover:bg-blue-900"
              }
            `}
          >
            Next
          </button>
        </div>
      </div>
    </form>
  );
} 