import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-brand mb-4">404</h1>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Page Not Found
          </h2>
          <p className="text-gray-600 mb-8">
            Sorry, we couldn&apos;t find the page you&apos;re looking for. 
            Let&apos;s get you back to choosing your car wash plan!
          </p>
        </div>
        
        <div className="space-y-4">
          <Link
            href="/"
            className="block w-full px-6 py-3 bg-brand text-white rounded-lg font-medium hover:bg-blue-900 transition-colors"
          >
            Choose Your Plan
          </Link>
          
          <Link
            href="/"
            className="block w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
} 