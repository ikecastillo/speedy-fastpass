export interface Plan {
  name: string;
  monthlyPrice: number;
  popular?: boolean;
}

export const plans: Plan[] = [
  { name: "Works+", monthlyPrice: 39.99 },
  { name: "Works", monthlyPrice: 34.99, popular: true },
  { name: "Deluxe", monthlyPrice: 24.99 },
  { name: "Basic", monthlyPrice: 19.99 },
];

export const getPlanByName = (planName: string): Plan | undefined => {
  return plans.find(plan => 
    plan.name.toLowerCase().replace('+', '-plus') === planName.toLowerCase()
  );
};

export const calculatePrice = (plan: Plan, period: 'monthly' | 'yearly'): number => {
  return period === 'yearly' ? plan.monthlyPrice * 10 : plan.monthlyPrice;
}; 