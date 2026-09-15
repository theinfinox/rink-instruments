'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, FileQuestion } from 'lucide-react';
import ResearchParticles from '@/components/ui/ResearchParticles';

export default function NotFound() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Start the countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Cleanup interval on unmount
    return () => clearInterval(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-[#F6F8FC] relative flex flex-col justify-between" style={{ zIndex: 0 }}>
      <main className="flex-1 flex items-center justify-center relative py-20 px-4">
        {/* Background aesthetics matching PortalManager */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10 z-0"
          style={{ backgroundImage: "url('/images/hero-bg.webp')" }}
          aria-hidden
        />
        
        {/* Particle effect layer */}
        <div className="absolute inset-0 z-0 opacity-50">
          <ResearchParticles />
        </div>

        {/* Main Content Card */}
        <div className="relative z-10 w-full max-w-lg bg-white/95 backdrop-blur shadow-2xl rounded-2xl border border-slate-100 p-8 sm:p-12 text-center animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="mx-auto w-20 h-20 bg-blue-50 text-[#1B4D9B] flex items-center justify-center rounded-full mb-6 ring-8 ring-blue-50/50">
            <FileQuestion className="w-10 h-10" />
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-[#0F172A] mb-4 tracking-tight">
            Page Not Found
          </h1>
          
          <p className="text-base text-slate-500 mb-8 max-w-sm mx-auto leading-relaxed font-sans">
            The instrument or service you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>

          {/* Countdown Indicator */}
          <div className="bg-[#F8FAFC] border border-slate-200 rounded-xl p-5 mb-8 flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent pointer-events-none" />
            <p className="text-xs font-bold text-[#1B4D9B] mb-2 uppercase tracking-[0.1em] relative z-10">
              Redirecting to Home in
            </p>
            <div className="text-[2.75rem] leading-none font-black text-[#0F172A] tabular-nums relative z-10 tracking-tighter">
              {countdown}
            </div>
            <p className="text-[10px] text-slate-400 mt-2 font-medium uppercase tracking-wider relative z-10">
              Seconds
            </p>
          </div>

          {/* Manual Fallback Action */}
          <Link 
            href="/"
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3.5 bg-[#1B4D9B] hover:bg-[#153b77] text-white rounded-xl font-semibold shadow-[0_4px_20px_rgba(27,77,155,0.25)] hover:shadow-[0_6px_25px_rgba(27,77,155,0.35)] hover:-translate-y-0.5 transition-all duration-200 active:scale-95 group"
          >
            Go to Home Page
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </main>
    </div>
  );
}
