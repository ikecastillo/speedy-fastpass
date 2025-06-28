import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Member Portal
          </h1>
          <p className="text-gray-600 mb-6">
            This is a placeholder for the existing member login system.
          </p>
          <div className="space-y-4">
            <div className="bg-gray-100 p-4 rounded-lg">
              <p className="text-sm text-gray-700">
                💡 In production, this would integrate with your existing customer portal
              </p>
            </div>
            <Link
              href="/"
              className="block w-full bg-brand text-white text-center py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 