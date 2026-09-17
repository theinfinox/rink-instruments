'use client';

/**
 * Skeleton Loader for Instrument Detail Page
 * Mirrors the exact DOM structure of page.tsx with animate-pulse placeholders.
 */

export default function InstrumentDetailLoading() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      
      {/* ── MOBILE STICKY BOTTOM CTA SKELETON ───────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 pt-3 pb-[calc(env(safe-area-inset-bottom,16px)+8px)] shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <div className="flex gap-3">
          <div className="flex-none w-[35%] py-3.5 rounded-xl border border-slate-200 shadow-sm bg-slate-100 animate-pulse h-12" />
          <div className="flex-1 rounded-xl bg-[#0A2164]/20 animate-pulse h-12" />
        </div>
      </div>

      <div className="pb-28 md:pb-0">

        {/* ══════════════════════════════════════════════════════
            SECTION 1 — HERO
        ══════════════════════════════════════════════════════ */}
        <section className="border-b border-slate-200 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-5 sm:pt-8 pb-8 sm:pb-12">

            {/* Smart Back Button */}
            <div className="mb-6">
              <div className="h-8 w-40 rounded-full bg-slate-100 animate-pulse" />
            </div>

            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 mb-8">
              {[40, 10, 70, 10, 200].map((w, i) => (
                <div
                  key={i}
                  className="h-3 rounded bg-slate-100 animate-pulse flex-shrink-0"
                  style={{ width: w === 10 ? 8 : w }}
                />
              ))}
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

              {/* LEFT COLUMN */}
              <div className="flex flex-col gap-5">

                {/* Category chips */}
                <div className="flex flex-wrap gap-2 items-center">
                  <div className="h-6 w-24 bg-slate-100 rounded-sm animate-pulse" />
                  <div className="h-6 w-20 bg-slate-100 rounded-sm animate-pulse" />
                  <div className="h-6 w-32 bg-slate-100 rounded-sm animate-pulse" />
                </div>

                {/* Title */}
                <div className="flex flex-col gap-4">
                  <div className="h-10 sm:h-12 w-full max-w-lg rounded-md bg-slate-100 animate-pulse" />
                  <div className="h-10 sm:h-12 w-3/4 max-w-md rounded-md bg-slate-100 animate-pulse" />
                </div>

                {/* Institution + ID */}
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="h-5 w-48 rounded bg-slate-100 animate-pulse" />
                  <div className="h-5 w-4 rounded bg-slate-100 animate-pulse" />
                  <div className="h-5 w-24 rounded bg-slate-100 animate-pulse" />
                </div>
              </div>

              {/* RIGHT COLUMN — Technology Image */}
              <div>
                <div className="rounded-md overflow-hidden border border-slate-200 shadow-sm aspect-[16/9] w-full bg-slate-100 animate-pulse" />
              </div>

            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            MAIN CONTENT — TWO-COLUMN GRID
        ══════════════════════════════════════════════════════ */}
        <section className="py-8 md:py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

              {/* ── LEFT / MAIN COLUMN ── */}
              <div className="lg:col-span-2 space-y-8">

                {/* ── SCOPE & APPLICATIONS ── */}
                <div className="space-y-3">
                  <div className="h-6 w-56 rounded bg-slate-100 animate-pulse" />
                  <div className="bg-blue-50/40 border border-blue-100 rounded-xl p-4 sm:p-5 space-y-2">
                    <div className="h-4 w-full rounded bg-blue-100/50 animate-pulse" />
                    <div className="h-4 w-11/12 rounded bg-blue-100/50 animate-pulse" />
                    <div className="h-4 w-4/5 rounded bg-blue-100/50 animate-pulse" />
                  </div>
                </div>

                {/* ── TECHNICAL SPECIFICATIONS ── */}
                <div className="space-y-3">
                  <div className="h-6 w-60 rounded bg-slate-100 animate-pulse" />
                  <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 sm:p-5 space-y-2">
                    <div className="h-4 w-full rounded bg-slate-200/50 animate-pulse" />
                    <div className="h-4 w-full rounded bg-slate-200/50 animate-pulse" />
                    <div className="h-4 w-3/4 rounded bg-slate-200/50 animate-pulse" />
                    <div className="h-4 w-5/6 rounded bg-slate-200/50 animate-pulse" />
                  </div>
                </div>

                {/* ── ADDRESS & LOCATION ── */}
                <div className="space-y-3">
                  <div className="h-6 w-48 rounded bg-slate-100 animate-pulse" />
                  <div className="space-y-2">
                    <div className="h-4 w-2/3 rounded bg-slate-100 animate-pulse" />
                    <div className="h-4 w-1/2 rounded bg-slate-100 animate-pulse" />
                  </div>
                </div>

                {/* ── CONTACT INFORMATION ── */}
                <div className="space-y-3">
                  <div className="h-6 w-48 rounded bg-slate-100 animate-pulse" />
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-200 animate-pulse" />
                      <div className="h-4 w-60 rounded bg-slate-100 animate-pulse" />
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-200 animate-pulse" />
                      <div className="h-4 w-44 rounded bg-slate-100 animate-pulse" />
                    </div>
                  </div>
                </div>

              </div>

              {/* ── RIGHT SIDEBAR ── */}
              <div className="lg:col-span-1">
                <div className="lg:sticky lg:top-24 space-y-4">

                  {/* Sidebar Card */}
                  <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                    
                    {/* Partner Institution */}
                    <div className="p-5 border-b border-slate-100">
                      <div className="h-3 w-32 rounded bg-slate-100 animate-pulse mb-3" />
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-md bg-slate-100 animate-pulse shrink-0" />
                        <div className="h-5 w-40 rounded bg-slate-100 animate-pulse" />
                      </div>
                      <div className="h-4 w-24 rounded bg-slate-100 animate-pulse mt-3" />

                      <div className="mt-4 pt-4 border-t border-slate-100">
                        <div className="h-3 w-28 rounded bg-slate-100 animate-pulse mb-2" />
                        <div className="h-4 w-48 rounded bg-slate-100 animate-pulse" />
                      </div>
                    </div>

                    {/* ── CTA ── */}
                    <div className="p-5 bg-gradient-to-br from-[#0A2164]/10 to-[#0d3285]/10 animate-pulse h-[140px]" />
                  </div>

                </div>
              </div>

            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
