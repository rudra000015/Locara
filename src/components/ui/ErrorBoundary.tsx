import { ReactNode } from 'react';

export default function ErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4v2m0 0a9 9 0 1 1 0-18 9 9 0 0 1 0 18z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Something went wrong</h2>
        <p className="text-gray-600 mb-6">We're having trouble loading this page. Please try refreshing.</p>
        <button
          onClick={() => window.location.reload()}
          className="w-full py-3 bg-gradient-to-r from-[#8d5524] to-[#b87333] text-white font-bold rounded-lg hover:shadow-lg transition-all"
        >
          Refresh Page
        </button>
      </div>
    </div>
  );
}
