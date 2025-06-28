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
    icon: '',
    features: [
      { name: 'Free self vacuums', included: true },
      { name: 'Presoak treatment', included: true },
      { name: 'Soft foam cleaning', included: true },
      { name: 'Spot free rinse', included: true },
      { name: 'Undercarriage rinse', included: false },
      { name: 'Magnum side & wheel blaster', included: false },
      { name: 'Clear coat sealant', included: false },
      { name: 'Triple foam conditioner', included: false },
      { name: 'Wheel boss cleaner', included: false },
      { name: 'Tire gloss', included: false },
      { name: 'HP vehicle cleaning', included: false },
      { name: 'Reflection mirror finish', included: false },
      { name: 'Carnauba wax', included: false },
      { name: 'Tire shine', included: false },
      { name: 'Speedy ceramic coating', included: false },
    ],
  },
  {
    id: 'deluxe',
    label: 'Deluxe',
    monthly: 24.99,
    yearly: 249.90,
    tagline: 'Enhanced cleaning power',
    icon: '',
    features: [
      { name: 'Free self vacuums', included: true },
      { name: 'Presoak treatment', included: true },
      { name: 'Soft foam cleaning', included: true },
      { name: 'Spot free rinse', included: true },
      { name: 'Undercarriage rinse', included: true },
      { name: 'Magnum side & wheel blaster', included: true },
      { name: 'Clear coat sealant', included: true },
      { name: 'Triple foam conditioner', included: false },
      { name: 'Wheel boss cleaner', included: false },
      { name: 'Tire gloss', included: false },
      { name: 'HP vehicle cleaning', included: false },
      { name: 'Reflection mirror finish', included: false },
      { name: 'Carnauba wax', included: false },
      { name: 'Tire shine', included: false },
      { name: 'Speedy ceramic coating', included: false },
    ],
  },
  {
    id: 'works',
    label: 'Works',
    monthly: 34.99,
    yearly: 349.90,
    tagline: 'Complete car care',
    icon: '',
    popular: true,
    features: [
      { name: 'Free self vacuums', included: true },
      { name: 'Presoak treatment', included: true },
      { name: 'Soft foam cleaning', included: true },
      { name: 'Spot free rinse', included: true },
      { name: 'Undercarriage rinse', included: true },
      { name: 'Magnum side & wheel blaster', included: true },
      { name: 'Clear coat sealant', included: true },
      { name: 'Triple foam conditioner', included: true },
      { name: 'Wheel boss cleaner', included: true },
      { name: 'Tire gloss', included: true },
      { name: 'HP vehicle cleaning', included: true },
      { name: 'Reflection mirror finish', included: true },
      { name: 'Carnauba wax', included: true },
      { name: 'Tire shine', included: true },
      { name: 'Speedy ceramic coating', included: false },
    ],
  },
  {
    id: 'works-plus',
    label: 'Works+',
    monthly: 39.99,
    yearly: 399.90,
    tagline: 'Ultimate protection',
    icon: '',
    features: [
      { name: 'Free self vacuums', included: true },
      { name: 'Presoak treatment', included: true },
      { name: 'Soft foam cleaning', included: true },
      { name: 'Spot free rinse', included: true },
      { name: 'Undercarriage rinse', included: true },
      { name: 'Magnum side & wheel blaster', included: true },
      { name: 'Clear coat sealant', included: true },
      { name: 'Triple foam conditioner', included: true },
      { name: 'Wheel boss cleaner', included: true },
      { name: 'Tire gloss', included: true },
      { name: 'HP vehicle cleaning', included: true },
      { name: 'Reflection mirror finish', included: true },
      { name: 'Carnauba wax', included: true },
      { name: 'Tire shine', included: true },
      { name: 'Speedy ceramic coating', included: true },
    ],
  },
];

export const getPlanById = (id: string): PlanMeta | undefined => {
  return plansMeta.find(plan => plan.id === id);
};

export const calculatePlanPrice = (plan: PlanMeta, period: 'monthly' | 'yearly'): number => {
  return period === 'yearly' ? plan.yearly : plan.monthly;
}; 