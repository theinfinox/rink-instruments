'use client';

import { useEffect } from 'react';
import { AlertCircle, RefreshCcw } from 'lucide-react';
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
      <body className="antialiased bg-white dark:bg-[#05112B]">
        <div className="min-h-screen flex items-center justify-center px-4 py-20">
          <div className="w-full max-w-lg bg-white dark:bg-[#0a1635] p-10 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-xl text-center mx-auto">
            
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-red-50 dark:bg-red-900/10 text-red-500 mb-6 border border-red-100 dark:border-red-900/20">
              <AlertCircle className="w-10 h-10" strokeWidth={1.5} />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">
              A critical error occurred
            </h1>
            
            <p className="text-base text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
              We encountered an unexpected systemic error that prevented the application from loading. 
            </p>

            <button
              onClick={() => reset()}
              className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 font-medium transition-colors w-full sm:w-auto text-sm shadow-sm"
            >
              <RefreshCcw className="w-4 h-4" />
              Refresh Page
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
