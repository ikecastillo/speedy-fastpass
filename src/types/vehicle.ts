import { z } from "zod";

// US States for dropdown
export const US_STATES = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
] as const;

const currentYear = new Date().getFullYear();

export const vehicleSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string()
    .min(14, "Phone number must be complete")
    .max(14, "Phone number must be in (###) ###-#### format")
    .regex(/^\(\d{3}\) \d{3}-\d{4}$/, "Phone number must be in (###) ###-#### format"),
  plate: z.string()
    .min(2, "License plate must be at least 2 characters")
    .max(8, "License plate must be at most 8 characters")
    .regex(/^[A-Z0-9]+$/, "License plate must contain only letters and numbers")
    .transform(val => val.toUpperCase()),
  state: z.enum(US_STATES, {
    errorMap: () => ({ message: "Please select a valid US state" })
  }),
  make: z.string().min(2, "Vehicle make must be at least 2 characters"),
  model: z.string().min(1, "Vehicle model is required"),
  year: z.string()
    .regex(/^\d{4}$/, "Year must be a 4-digit number")
    .refine(val => {
      const numYear = parseInt(val, 10);
      return numYear >= 1900 && numYear <= currentYear;
    }, `Year must be between 1900 and ${currentYear}`),
  agreeTos: z.boolean().refine(val => val === true, {
    message: "You must agree to the Terms of Service"
  })
});

export type VehicleForm = z.infer<typeof vehicleSchema>; 