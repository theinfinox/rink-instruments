export default function Loading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gray-50 dark:bg-[#05112B]">
      {/* RINK Branded Spinner */}
      <div className="relative w-20 h-20 mb-8">
        <div className="absolute inset-0 rounded-full border-4 border-slate-200 dark:border-slate-800"></div>
        <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
        <div className="absolute inset-2 rounded-full border-4 border-yellow-400 border-b-transparent animate-spin-reverse" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
      </div>
      
      <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-2">
        Loading Data...
      </h2>
      <p className="text-slate-500 dark:text-slate-400">
        Fetching the latest instruments and services from Kerala's institutions
      </p>
    </div>
  );
}
