'use client';

/**
 * Skeleton Loader for Service Detail Page
 * Mirrors the exact DOM structure of the max-w-4xl single-column layout.
 */

export default function ServiceDetailLoading() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      
      {/* ── MOBILE STICKY BOTTOM CTA SKELETON ───────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 pt-3 pb-[calc(env(safe-area-inset-bottom,16px)+8px)] shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <div className="flex gap-3">
          <div className="flex-none w-[35%] py-3.5 rounded-xl border border-slate-200 shadow-sm bg-slate-100 animate-pulse h-12" />
          <div className="flex-1 rounded-xl bg-[#0A2164]/20 animate-pulse h-12" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 sm:py-12 pb-28 md:pb-12">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 mb-4">
          {[40, 10, 60, 10, 80, 10, 200].map((w, i) => (
            <div
              key={i}
              className="h-3 rounded bg-slate-200 animate-pulse flex-shrink-0"
              style={{ width: w === 10 ? 8 : w }}
            />
          ))}
        </nav>

        {/* Smart Back */}
        <div className="mb-6">
          <div className="h-8 w-40 rounded-full bg-slate-200 animate-pulse" />
        </div>
        
        {/* Main White Card */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-8">
          
          {/* Category chips */}
          <div className="flex flex-wrap items-center gap-2 mb-4 sm:mb-6">
            <div className="h-6 w-24 bg-blue-50 rounded-full animate-pulse" />
            <div className="h-6 w-28 bg-slate-100 rounded-full animate-pulse" />
          </div>
          
          {/* Title */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
            <div className="w-full">
              <div className="h-8 md:h-10 w-full max-w-lg rounded-md bg-slate-100 animate-pulse mb-2" />
              <div className="h-8 md:h-10 w-3/4 max-w-md rounded-md bg-slate-100 animate-pulse" />
            </div>
            {/* Share button placeholder on desktop */}
            <div className="hidden sm:block w-24 h-10 rounded-full bg-slate-100 animate-pulse shrink-0" />
          </div>
          
          {/* Startup / Location Row */}
          <div className="flex flex-wrap items-center gap-2 mb-8">
            <div className="h-5 w-48 rounded bg-slate-100 animate-pulse" />
            <div className="h-5 w-4 rounded bg-slate-100 animate-pulse mx-1" />
            <div className="h-5 w-24 rounded bg-slate-100 animate-pulse" />
            <div className="h-5 w-4 rounded bg-slate-100 animate-pulse mx-1" />
            <div className="h-5 w-20 rounded bg-slate-100 animate-pulse" />
          </div>
          
          {/* About this Service */}
          <div className="mb-8 space-y-3">
            <div className="h-6 w-40 rounded bg-slate-100 animate-pulse mb-1" />
            <div className="h-4 w-full rounded bg-slate-50 animate-pulse" />
            <div className="h-4 w-full rounded bg-slate-50 animate-pulse" />
            <div className="h-4 w-5/6 rounded bg-slate-50 animate-pulse" />
            <div className="h-4 w-3/4 rounded bg-slate-50 animate-pulse" />
          </div>

          {/* Equipment & Testing Capabilities */}
          <div className="mb-8 p-5 bg-slate-50/80 rounded-xl border border-slate-100">
            <div className="h-4 w-64 rounded bg-slate-200 animate-pulse mb-4" />
            <div className="flex flex-wrap gap-2">
              {[80, 120, 90, 150, 100].map((w, i) => (
                <div key={i} className="h-7 bg-white border border-slate-200 rounded-md animate-pulse" style={{ width: w }} />
              ))}
            </div>
          </div>
          
          {/* 2-Column Grid (Infrastructure & Certifications) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="p-4 bg-white border border-slate-100 rounded-xl">
              <div className="h-4 w-32 rounded bg-slate-100 animate-pulse mb-3" />
              <div className="space-y-2">
                <div className="h-3 w-full rounded bg-slate-50 animate-pulse" />
                <div className="h-3 w-4/5 rounded bg-slate-50 animate-pulse" />
              </div>
            </div>
            <div className="p-4 bg-white border border-slate-100 rounded-xl">
              <div className="h-4 w-32 rounded bg-slate-100 animate-pulse mb-3" />
              <div className="space-y-2">
                <div className="h-3 w-full rounded bg-slate-50 animate-pulse" />
                <div className="h-3 w-5/6 rounded bg-slate-50 animate-pulse" />
              </div>
            </div>
          </div>
          
          {/* Bottom CTA Block */}
          <div className="p-5 sm:p-6 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200/60 animate-pulse">
            <div className="h-5 w-48 rounded bg-slate-200 mb-2" />
            <div className="h-4 w-3/4 rounded bg-slate-200 mb-6" />
            <div className="h-12 w-40 rounded-xl bg-slate-300" />
          </div>

        </div>
      </div>
    </div>
  );
}
