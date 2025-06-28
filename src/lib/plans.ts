export interface PlanFeature {
  name: string;
  included: boolean;
}

export interface PlanMeta {
  id: string;
  label: string;
  monthly: number;
  yearly: number;
  tagline: string;
  features: PlanFeature[];
  promo?: {
    text: string;
    condition: 'works' | 'works-plus';
  };
  popular?: boolean;
  icon: string;
}

export const plansMeta: PlanMeta[] = [
  {
    id: 'basic',
    label: 'Basic',
    monthly: 19.99,
    yearly: 199.90,
    tagline: 'Essential car care',
    icon: '🚿',
    features: [
      { name: 'Unlimited wash', included: true },
      { name: 'Basic soap', included: true },
      { name: 'Premium soap & wax', included: false },
      { name: 'Interior vac', included: false },
      { name: 'Tire shine', included: false },
    ],
  },
  {
    id: 'deluxe',
    label: 'Deluxe',
    monthly: 24.99,
    yearly: 249.90,
    tagline: 'Enhanced cleaning power',
    icon: '✨',
    popular: true,
    features: [
      { name: 'Unlimited wash', included: true },
      { name: 'Basic soap', included: true },
      { name: 'Premium soap & wax', included: true },
      { name: 'Interior vac', included: false },
      { name: 'Tire shine', included: false },
    ],
  },
  {
    id: 'works',
    label: 'Works',
    monthly: 34.99,
    yearly: 349.90,
    tagline: 'Complete car care',
    icon: '🏆',
    promo: {
      text: '$5 first month',
      condition: 'works',
    },
    features: [
      { name: 'Unlimited wash', included: true },
      { name: 'Basic soap', included: true },
      { name: 'Premium soap & wax', included: true },
      { name: 'Interior vac', included: true },
      { name: 'Tire shine', included: false },
    ],
  },
  {
    id: 'works-plus',
    label: 'Works+',
    monthly: 39.99,
    yearly: 399.90,
    tagline: 'Ultimate protection',
    icon: '👑',
    promo: {
      text: '$5 first month',
      condition: 'works-plus',
    },
    features: [
      { name: 'Unlimited wash', included: true },
      { name: 'Basic soap', included: true },
      { name: 'Premium soap & wax', included: true },
      { name: 'Interior vac', included: true },
      { name: 'Tire shine', included: true },
    ],
  },
];

export const getPlanById = (id: string): PlanMeta | undefined => {
  return plansMeta.find(plan => plan.id === id);
};

export const calculatePlanPrice = (plan: PlanMeta, period: 'monthly' | 'yearly'): number => {
  return period === 'yearly' ? plan.yearly : plan.monthly;
}; 