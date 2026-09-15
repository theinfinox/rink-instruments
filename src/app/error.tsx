'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, RefreshCcw, Home } from 'lucide-react';

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
    <div className="flex-1 flex flex-col items-center justify-center bg-white dark:bg-[#0a1635] px-4 py-20 w-full rounded-2xl border border-gray-100 dark:border-slate-800/60 shadow-sm my-8 max-w-4xl mx-auto">
      <div className="text-center max-w-md mx-auto">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-red-50 dark:bg-red-900/10 text-red-500 mb-6 border border-red-100 dark:border-red-900/20">
          <AlertCircle className="w-10 h-10" strokeWidth={1.5} />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">
          Oops! Something went wrong
        </h1>
        
        <p className="text-base text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
          We encountered an unexpected issue while loading this content. Please try refreshing the page or navigating back home.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 font-medium transition-colors w-full sm:w-auto text-sm"
          >
            <RefreshCcw className="w-4 h-4" />
            Try Again
          </button>
          
          <Link 
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-200 font-medium transition-colors border border-gray-200 dark:border-slate-700 w-full sm:w-auto text-sm"
          >
            <Home className="w-4 h-4" />
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
