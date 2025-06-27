"use client";

import React from "react";
import { getPlanByName, calculatePrice } from "@/types/plan";

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
}

interface PaymentData {
  cardLast4: string;
  timestamp: string;
  planName: string;
  period: 'monthly' | 'yearly';
}

interface OrderSummaryProps {
  planName: string;
  period: 'monthly' | 'yearly';
  vehicleData?: VehicleData;
  paymentData?: PaymentData;
}

export function OrderSummary({ planName, period, vehicleData, paymentData }: OrderSummaryProps) {
  const plan = getPlanByName(planName);
  
  if (!plan) {
    return <div>Plan not found</div>;
  }

  const price = calculatePrice(plan, period);
  const savings = period === 'yearly' ? (plan.monthlyPrice * 12) - price : 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
      
      {/* Plan Details */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900">Membership Plan</h4>
        <dl className="grid grid-cols-1 gap-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-gray-600">Plan:</dt>
            <dd className="font-medium">{plan.name}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-600">Billing:</dt>
            <dd className="font-medium capitalize">{period}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-600">Price:</dt>
            <dd className="font-medium">${price.toFixed(2)}</dd>
          </div>
          {savings > 0 && (
            <div className="flex justify-between text-green-600">
              <dt>Annual Savings:</dt>
              <dd className="font-medium">${savings.toFixed(2)}</dd>
            </div>
          )}
        </dl>
      </div>

      {/* Vehicle Details */}
      {vehicleData && (
        <div className="space-y-3 border-t pt-4">
          <h4 className="font-medium text-gray-900">Vehicle Information</h4>
          <dl className="grid grid-cols-1 gap-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-600">Vehicle:</dt>
              <dd className="font-medium">
                {vehicleData.year} {vehicleData.make} {vehicleData.model}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-600">License Plate:</dt>
              <dd className="font-medium font-mono">{vehicleData.plate}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-600">State:</dt>
              <dd className="font-medium">{vehicleData.state}</dd>
            </div>
          </dl>
        </div>
      )}

      {/* Purchaser Details */}
      {vehicleData && (
        <div className="space-y-3 border-t pt-4">
          <h4 className="font-medium text-gray-900">Account Holder</h4>
          <dl className="grid grid-cols-1 gap-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-600">Name:</dt>
              <dd className="font-medium">
                {vehicleData.firstName} {vehicleData.lastName}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-600">Email:</dt>
              <dd className="font-medium">{vehicleData.email}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-600">Phone:</dt>
              <dd className="font-medium">{vehicleData.phone}</dd>
            </div>
          </dl>
        </div>
      )}

      {/* Payment Method (last 4 only) */}
      {paymentData?.cardLast4 && (
        <div className="space-y-3 border-t pt-4">
          <h4 className="font-medium text-gray-900">Payment Method</h4>
          <dl className="grid grid-cols-1 gap-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-600">Card ending in:</dt>
              <dd className="font-medium font-mono">****{paymentData.cardLast4}</dd>
            </div>
          </dl>
        </div>
      )}
    </div>
  );
} 