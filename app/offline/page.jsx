'use client';

export default function Offline() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-6">
          <div className="text-6xl mb-4">📡</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">You're Offline</h1>
          <p className="text-gray-600 mb-6">
            It looks like you've lost your internet connection. Some features may be limited, but you can still browse our services.
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h2 className="font-semibold text-blue-900 mb-2">What you can do:</h2>
          <ul className="text-sm text-blue-800 text-left space-y-1">
            <li>✓ Browse services and pricing</li>
            <li>✓ View past pages you've visited</li>
            <li>✗ Submit inquiry forms (will sync when online)</li>
            <li>✗ View live project updates</li>
          </ul>
        </div>

        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
        >
          Try Again
        </button>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Questions? Email us at hello@c3bai.com or check back when you're online.
          </p>
        </div>
      </div>
    </div>
  );
}
