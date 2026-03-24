import { ReactNode } from 'react';

export default function LoadingSpinner({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-4">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-6">
          <div className="w-full h-full border-4 border-[#b87333]/20 border-t-[#b87333] rounded-full animate-spin" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Locara</h2>
        <p className="text-gray-400">{message}</p>
      </div>
    </div>
  );
}
