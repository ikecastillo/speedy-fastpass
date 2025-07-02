"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { vehicleSchema, type VehicleForm, US_STATES } from "@/types/vehicle";
import { 
  saveVehicleData, 
  getCheckoutData, 
  migrateOldCheckoutData 
} from "@/lib/checkout-data";

interface VehicleFormProps {
  onValidityChange?: (isValid: boolean) => void;
}

export function VehicleFormComponent({ onValidityChange }: VehicleFormProps = {}) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  // Initialize form with any existing data and migrate old data if needed
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      // Migrate old data format if it exists
      migrateOldCheckoutData();
      
      // Load existing vehicle data if available
      const checkoutData = getCheckoutData();
      if (checkoutData?.vehicle) {
        console.log('Loading existing vehicle data:', checkoutData.vehicle);
        // Populate form with existing data
        Object.entries(checkoutData.vehicle).forEach(([key, value]) => {
          setValue(key as keyof VehicleForm, value, { shouldValidate: true });
        });
      }
    }
  }, []);
  
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
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

  const onSubmit = async (data: VehicleForm) => {
    console.log('🚀 Vehicle form submitted:', data);
    setIsSubmitting(true);
    
    try {
      // Save vehicle data using new system
      saveVehicleData(data);
      console.log('✅ Vehicle data saved successfully');
      
      // Form submission successful - navigation will be handled by PersistentPlanBar
      // The form validity will trigger the continue button to become enabled
    } catch (error) {
      console.error('❌ Failed to save vehicle data:', error);
      // Could show error message to user here if needed
    } finally {
      setIsSubmitting(false);
    }
  };



  // Notify parent of form validity changes and auto-save when valid
  React.useEffect(() => {
    if (onValidityChange) {
      onValidityChange(isValid);
    }
    
    // Auto-save form data when valid (so navigation can proceed immediately)
    if (isValid && !isSubmitting) {
      const formData = watch();
      try {
        saveVehicleData(formData);
        console.log('🔄 Auto-saved vehicle data on validation change');
      } catch (error) {
        console.error('❌ Failed to auto-save vehicle data:', error);
      }
    }
  }, [isValid, onValidityChange, isSubmitting, watch]);

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
              <div className="relative">
              <select
                {...register("state")}
                id="state"
                aria-invalid={errors.state ? "true" : "false"}
                className={`
                    w-full px-4 py-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-[16px] transition-all appearance-none bg-white pr-10
                    ${errors.state ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-gray-400"}
                `}
              >
                {US_STATES.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
                  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
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
              <div className="relative">
                <select
                {...register("make")}
                id="make"
                aria-invalid={errors.make ? "true" : "false"}
                className={`
                    w-full px-4 py-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-[16px] transition-all appearance-none bg-white pr-10
                    ${errors.make ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-gray-400"}
                `}
                >
                  <option value="">Select Make</option>
                  <option value="Acura">Acura</option>
                  <option value="Audi">Audi</option>
                  <option value="BMW">BMW</option>
                  <option value="Buick">Buick</option>
                  <option value="Cadillac">Cadillac</option>
                  <option value="Chevrolet">Chevrolet</option>
                  <option value="Chrysler">Chrysler</option>
                  <option value="Dodge">Dodge</option>
                  <option value="Ford">Ford</option>
                  <option value="GMC">GMC</option>
                  <option value="Honda">Honda</option>
                  <option value="Hyundai">Hyundai</option>
                  <option value="Infiniti">Infiniti</option>
                  <option value="Jeep">Jeep</option>
                  <option value="Kia">Kia</option>
                  <option value="Lexus">Lexus</option>
                  <option value="Lincoln">Lincoln</option>
                  <option value="Mazda">Mazda</option>
                  <option value="Mercedes-Benz">Mercedes-Benz</option>
                  <option value="Mitsubishi">Mitsubishi</option>
                  <option value="Nissan">Nissan</option>
                  <option value="Ram">Ram</option>
                  <option value="Subaru">Subaru</option>
                  <option value="Tesla">Tesla</option>
                  <option value="Toyota">Toyota</option>
                  <option value="Volkswagen">Volkswagen</option>
                  <option value="Volvo">Volvo</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
                  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
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
              <div className="relative">
                <select
                {...register("model")}
                id="model"
                aria-invalid={errors.model ? "true" : "false"}
                className={`
                    w-full px-4 py-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-[16px] transition-all appearance-none bg-white pr-10
                    ${errors.model ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-gray-400"}
                `}
                >
                  <option value="">Select Model</option>
                  <option value="Accord">Accord</option>
                  <option value="Altima">Altima</option>
                  <option value="Camaro">Camaro</option>
                  <option value="Camry">Camry</option>
                  <option value="Civic">Civic</option>
                  <option value="Corolla">Corolla</option>
                  <option value="CR-V">CR-V</option>
                  <option value="Cruze">Cruze</option>
                  <option value="Elantra">Elantra</option>
                  <option value="Escape">Escape</option>
                  <option value="Explorer">Explorer</option>
                  <option value="F-150">F-150</option>
                  <option value="Focus">Focus</option>
                  <option value="Forester">Forester</option>
                  <option value="Fusion">Fusion</option>
                  <option value="Grand Cherokee">Grand Cherokee</option>
                  <option value="Highlander">Highlander</option>
                  <option value="Impala">Impala</option>
                  <option value="Malibu">Malibu</option>
                  <option value="Model 3">Model 3</option>
                  <option value="Model S">Model S</option>
                  <option value="Model X">Model X</option>
                  <option value="Model Y">Model Y</option>
                  <option value="Mustang">Mustang</option>
                  <option value="Outback">Outback</option>
                  <option value="Pathfinder">Pathfinder</option>
                  <option value="Pilot">Pilot</option>
                  <option value="Prius">Prius</option>
                  <option value="RAV4">RAV4</option>
                  <option value="Rogue">Rogue</option>
                  <option value="Santa Fe">Santa Fe</option>
                  <option value="Sentra">Sentra</option>
                  <option value="Silverado">Silverado</option>
                  <option value="Sonata">Sonata</option>
                  <option value="Sorento">Sorento</option>
                  <option value="Suburban">Suburban</option>
                  <option value="Tahoe">Tahoe</option>
                  <option value="Taurus">Taurus</option>
                  <option value="Wrangler">Wrangler</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
                  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
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
              <div className="relative">
                <select
              {...register("year")}
              id="year"
              aria-invalid={errors.year ? "true" : "false"}
              className={`
                    w-full px-4 py-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-[16px] transition-all appearance-none bg-white pr-10
                    ${errors.year ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-gray-400"}
                  `}
                >
                  <option value="">Year</option>
                  {Array.from({ length: 25 }, (_, i) => 2024 - i).map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
                  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
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

      {/* Auto-fill Button - Updated for new dropdowns */}
      <div className="flex justify-center pt-4">
        <button
          type="button"
          onClick={handleSimulate}
          className="px-6 py-3 bg-yellow-100 text-yellow-800 rounded-xl font-medium hover:bg-yellow-200 transition-colors border border-yellow-300 flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
          </svg>
          Auto-fill Demo Data
        </button>
      </div>
    </form>
  );
} 