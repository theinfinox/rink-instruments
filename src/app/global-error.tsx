'use client';

import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import '../app/globals.css';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global Error caught:', error);
  }, [error]);

  return (
    <html lang="en">
      <body className="antialiased bg-gray-50 dark:bg-[#05112B]">
        <div className="min-h-screen flex items-center justify-center px-4 py-16">
          <div className="text-center max-w-lg mx-auto">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-500 mb-8">
              <AlertTriangle className="w-12 h-12" />
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              A critical error occurred
            </h1>
            
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              We encountered an unexpected systemic error. Please try refreshing the page.
            </p>

            <button
              onClick={() => reset()}
              className="px-8 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
