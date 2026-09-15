'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service in production
    console.error('App Error boundary caught:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 dark:bg-[#05112B] px-4 py-16">
      <div className="text-center max-w-lg mx-auto">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-500 mb-8">
          <AlertTriangle className="w-12 h-12" />
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Something went wrong
        </h1>
        
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          We encountered an unexpected error while trying to process your request. 
          Please try again or return to the homepage.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => reset()}
            className="px-8 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors w-full sm:w-auto"
          >
            Try Again
          </button>
          
          <Link 
            href="/"
            className="px-8 py-3 rounded-full bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium transition-colors border border-slate-200 dark:border-slate-700 w-full sm:w-auto"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
