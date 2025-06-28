import Link from 'next/link';

export function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-blue-50 to-white py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Hero headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Unlimited shine with{' '}
            <span className="text-brand">Speedy FastPass</span>
          </h1>
          
          {/* Subtext */}
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Get your car sparkling clean anytime with our unlimited car wash membership. 
            Choose from four plans designed to keep your vehicle looking its best.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="/plan"
              className="bg-brand text-white text-lg font-semibold px-8 py-4 rounded-full hover:bg-blue-700 transition-colors w-full sm:w-auto"
            >
              Get Started
            </Link>
            <Link 
              href="/login"
              className="text-brand border-2 border-brand text-lg font-semibold px-8 py-4 rounded-full hover:bg-brand hover:text-white transition-colors w-full sm:w-auto"
            >
              I already have a FastPass
            </Link>
          </div>
        </div>
      </div>
      
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent opacity-10 rounded-full"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-brand opacity-5 rounded-full"></div>
      </div>
    </section>
  );
} 