# 🚗💨 Speedy FastPass

[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ikecastillo/speedy-fastpass)

Unlimited car wash subscription service built with Next.js 15, React 19, and TypeScript. Complete customer signup flow from plan selection to payment processing with celebration success screen.

## 🎯 Project Purpose

Speedy FastPass is a modern web application for car wash membership subscriptions. Users can:
- Select from 4 subscription plans (Basic, Deluxe, Works, Works+)
- Choose monthly or yearly billing
- Enter vehicle and personal information
- Process simulated payments
- Celebrate with confetti on successful signup

## 🛠️ Tech Stack

- **Framework:** Next.js 15.3.4 with App Router
- **Frontend:** React 19, TypeScript 5.x
- **Styling:** Tailwind CSS 4.x with custom brand colors
- **Forms:** react-hook-form + zod validation
- **UI Components:** shadcn/ui + originui inputs
- **Animations:** Framer Motion + react-confetti
- **Payment:** Card validation with card-validator
- **State:** localStorage for wizard flow
- **Deployment:** Vercel

## 🎨 Brand Colors

- **Primary Blue:** `#1e40af` (--color-brand) - Professional darker blue
- **Accent Yellow:** `#FFCC00` (--color-accent)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm

### Local Development

```bash
# Clone the repository
git clone https://github.com/ikecastillo/speedy-fastpass.git
cd speedy-fastpass

# Install dependencies
pnpm install

# Start development server
pnpm run dev

# Open in browser
open http://localhost:3000
```

### Environment Setup

Copy `.env.example` to `.env.local` and configure:

```bash
cp .env.example .env.local
```

## 🧪 Quick Demo with Auto-Fill Buttons

For instant demo experience, use the prominent **Auto-Fill** buttons (always visible):

1. **Plan Selection** → Click "🎯 Auto-Demo (Deluxe + Yearly)" to auto-select best plan
2. **Vehicle Form** → Click "🚀 Auto-fill Demo Data" to populate:
   - Name: Jane Doe
   - Vehicle: 2022 Toyota Camry, Texas plate ABC1234
   - Phone & email auto-filled
3. **Payment Form** → Click "💳 Auto-fill Test Card" to populate:
   - Card: 4532 1234 5678 9012
   - Expiry: 12/26, CVC: 123
4. **Success Page** → See confetti celebration! 🎉

**Complete demo in under 10 seconds!** Perfect for showcasing the full flow.

## 📋 Phase Development

The project was built in 7 structured phases:

```
Phase 0: Hard Reset           🔄 Clean slate
Phase 1: Project Scaffold     🏗️  Next.js + Tailwind setup
Phase 2: PricingSelector      💰 Plan selection with animations
Phase 3: Wizard Routing       🧭 Multi-step flow + stepper
Phase 4: Vehicle Form         🚗 Personal + vehicle info with validation
Phase 5: Payment Processing   💳 Card input + simulated payment
Phase 6: Success Celebration  🎉 Confetti + order summary
Phase 7: Polish & Deploy      ✨ Accessibility + SEO + Vercel
```

## 🎯 User Flow

```
/plan → /checkout/vehicle → /checkout/payment → /checkout/success
  ↓            ↓                    ↓                ↓
Select      Enter Info         Process           Celebrate
Plan        & Vehicle          Payment           Success
```

## 🎭 Key Features

- **Responsive Design** - Mobile-first Tailwind CSS
- **Form Validation** - Real-time validation with zod schemas
- **Card Detection** - Auto-detect Visa/Mastercard/Amex/Discover
- **Accessibility** - WCAG compliant, keyboard navigation
- **SEO Optimized** - Meta tags, OpenGraph, sitemap
- **Error Handling** - Graceful fallbacks and validation
- **Loading States** - Smooth transitions and feedback
- **Local Storage** - Persist data across wizard steps

## 🚀 Live Demo

**Production:** [https://speedy-fastpass-f0o0h1qmd-ikecastillos-projects.vercel.app](https://speedy-fastpass-f0o0h1qmd-ikecastillos-projects.vercel.app)

## 📊 Performance Scores

- **Performance:** 65/100 ⚡
- **Accessibility:** 100/100 ♿
- **Best Practices:** Not tested ✅
- **SEO:** Not tested 🔍

*Scores from Lighthouse audit (localhost)*

## 🛠️ Available Scripts

```bash
# Development
pnpm run dev          # Start dev server
pnpm run build        # Production build
pnpm run start        # Start production server
pnpm run lint         # ESLint check
pnpm run type-check   # TypeScript check
```

## 📂 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── checkout/
│   │   ├── vehicle/        # Vehicle form page
│   │   ├── payment/        # Payment form page
│   │   └── success/        # Success celebration
│   ├── plan/               # Plan selection page
│   ├── layout.tsx          # Root layout + metadata
│   ├── page.tsx            # Homepage (redirects to /plan)
│   ├── not-found.tsx       # 404 page
│   ├── robots.txt          # SEO robots file
│   └── sitemap.xml         # SEO sitemap
├── components/
│   ├── ui/                 # Reusable UI components
│   ├── PricingSelector.tsx # Plan selection with animations
│   ├── VehicleForm.tsx     # Vehicle + personal info form
│   ├── PaymentForm.tsx     # Credit card payment form
│   ├── OrderSummary.tsx    # Order details display
│   ├── Stepper.tsx         # Progress indicator
│   └── SuccessConfetti.tsx # Celebration confetti
├── lib/
│   └── utils.ts            # Utility functions
└── types/
    ├── plan.ts             # Plan data types
    └── vehicle.ts          # Vehicle form types
```

## 🤝 Contributing

This is a demo project showcasing modern React/Next.js patterns. For improvements:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - feel free to use this project as a reference for your own applications!

---

**Built with ❤️ by Ike Castillo**

## Environment Variables

Create a `.env.local` file in the project root:

```bash
# Stripe Configuration
# Insert real keys before production
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
```

## Development

1. Install dependencies:
```bash
pnpm install
```

2. Start the development server:
```bash
pnpm dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Testing

### Stripe Test Cards

For testing payments, use these test card numbers:

- **Success**: `4242 4242 4242 4242`
- **Requires Authentication**: `4000 0025 0000 3155`
- **Declined**: `4000 0000 0000 0002`

Use any future expiry date and any 3-digit CVC.

### Features to Test

1. **Landing Page**: Navigate through plan selection
2. **Mobile Responsiveness**: Test on various screen sizes
3. **Form Validation**: Try invalid inputs in vehicle/customer forms
4. **Phone Formatting**: Verify auto-formatting as `(###) ###-####`
5. **Insurance Card Scanner**: Test file upload (shows preview)
6. **Stripe Payment**: Complete checkout with test cards
7. **Feature Collapsing**: Expand/collapse plan features on landing page

## Project Structure

```
src/
├── app/
│   ├── actions/           # Server actions (Stripe integration)
│   ├── checkout/         # Multi-step checkout flow
│   └── plan/            # Plan selection page
├── components/
│   ├── ui/              # Reusable UI components
│   ├── Header.tsx       # Navigation header
│   ├── Hero.tsx         # Landing page hero
│   ├── PlansGrid.tsx    # Plan selection grid
│   ├── WashFeatures.tsx # Collapsible feature lists
│   └── Stripe*.tsx      # Stripe payment components
├── lib/
│   └── plans.ts         # Centralized plan metadata
└── types/
    ├── plan.ts          # Plan type definitions
    └── vehicle.ts       # Vehicle form types
```

## Technologies Used

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Stripe** - Payment processing
- **Framer Motion** - Smooth animations
- **React Hook Form** - Form management with validation
- **Zod** - Schema validation

## Production Notes

Before deploying to production:

1. Replace fake Stripe keys with real ones
2. Create Stripe products and prices to match plan IDs
3. Set up the `first-month-five` coupon in Stripe dashboard
4. Configure proper domain for Stripe webhook endpoints
5. Test payment flows end-to-end
6. Run Lighthouse audit for performance optimization

## License

This project is for demonstration purposes.
