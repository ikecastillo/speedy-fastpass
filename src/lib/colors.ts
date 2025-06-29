// Professional Brand Color Palette
// Easy to modify and maintain brand colors

export const colors = {
  // Core Brand Colors
  primary: {
    navy: '#0B2545',
    navyHover: '#163E6B', 
    navyPressed: '#081A32',
  },
  accent: {
    yellow: '#FFD60A',
    yellowHover: '#FFCA00',
    yellowPressed: '#D4A800',
  },
  
  // Support & Utility
  secondary: {
    midBlue: '#1463B4',
    midBlueHover: '#12579C', 
    midBluePressed: '#0E4377',
  },
  
  // Neutrals (Greyscale ramp)
  neutral: {
    white: '#FFFFFF',
    100: '#F5F7FA',
    200: '#E4E7EB', 
    300: '#C8CDD2',
    400: '#9EA5AD',
    500: '#6F7780',
    600: '#474D55',
    700: '#2F343A',
    800: '#1E2125',
  }
} as const;

// CSS custom properties for easy use in Tailwind
export const cssVariables = {
  '--color-primary-navy': colors.primary.navy,
  '--color-primary-navy-hover': colors.primary.navyHover,
  '--color-primary-navy-pressed': colors.primary.navyPressed,
  '--color-accent-yellow': colors.accent.yellow,
  '--color-accent-yellow-hover': colors.accent.yellowHover,
  '--color-accent-yellow-pressed': colors.accent.yellowPressed,
  '--color-secondary-mid-blue': colors.secondary.midBlue,
  '--color-secondary-mid-blue-hover': colors.secondary.midBlueHover,
  '--color-secondary-mid-blue-pressed': colors.secondary.midBluePressed,
  '--color-neutral-white': colors.neutral.white,
  '--color-neutral-100': colors.neutral[100],
  '--color-neutral-200': colors.neutral[200],
  '--color-neutral-300': colors.neutral[300],
  '--color-neutral-400': colors.neutral[400],
  '--color-neutral-500': colors.neutral[500],
  '--color-neutral-600': colors.neutral[600],
  '--color-neutral-700': colors.neutral[700],
  '--color-neutral-800': colors.neutral[800],
} as const; 