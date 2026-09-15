import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Building2, ExternalLink, ChevronRight, Microscope, MapPin, ShieldCheck, Layers } from 'lucide-react';
import { fetchDataset } from '@/lib/dataFetcher';
import { Service } from '@/types/service';
import SmartBack from '@/components/ui/SmartBack';

export const dynamicParams = true;

export async function generateStaticParams() {
  const services: Service[] = await fetchDataset('services');
  return services.map(s => ({ id: s.id || s.serviceName }));
}

function findService(services: Service[], id: string) {
  const decoded = decodeURIComponent(id);
  const normalized = decoded.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  return services.find(s => 
    (s.id && s.id === decoded) || 
    s.serviceName === decoded ||
    (s.serviceName && s.serviceName.toLowerCase().replace(/[^a-z0-9]+/g, '-') === normalized)
  );
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const services: Service[] = await fetchDataset('services');
  const service = findService(services, id);
  
  if (!service) return { title: 'Service Not Found — RINK' };
  
  return {
    title: `${service.serviceName} | ${service.startupName} — RINK Services`,
    description: service.description || `Research service offered by ${service.startupName}.`,
    openGraph: {
      title: `${service.serviceName} | ${service.startupName}`,
      description: service.description || `Research service offered by ${service.startupName}.`,
      type: 'article',
    },
  };
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const services: Service[] = await fetchDataset('services');
  const service = findService(services, id);

  if (!service) {
    notFound();
  }

  const formattedBookingUrl = service.bookingUrl 
    ? (service.bookingUrl.startsWith('http://') || service.bookingUrl.startsWith('https://') ? service.bookingUrl : `https://${service.bookingUrl}`)
    : null;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* ── MOBILE STICKY BOTTOM CTA ───────────────────────── */}
      {formattedBookingUrl && (
        <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 pt-3 pb-[calc(env(safe-area-inset-bottom,16px)+8px)] shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
          <a
            href={formattedBookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-[#0A2164] text-white font-semibold text-sm shadow-md active:scale-[0.98] transition-all"
          >
            <span>Visit Website</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 py-6 sm:py-12 pb-28 md:pb-12">
        <nav className="flex items-center gap-1.5 text-xs text-slate-500 flex-wrap mb-4" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-[#0A2164] transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3 text-slate-300" />
          <Link href="/services" className="hover:text-[#0A2164] transition-colors">Services</Link>
          <ChevronRight className="w-3 h-3 text-slate-300" />
          <Link href="/services/list" className="hover:text-[#0A2164] transition-colors">All Services</Link>
          <ChevronRight className="w-3 h-3 text-slate-300" />
          <span className="text-slate-900 font-medium truncate max-w-[200px] sm:max-w-sm">{service.serviceName}</span>
        </nav>

        <div className="mb-6">
          <SmartBack fallbackUrl="/services/list" label="Back to Services" />
        </div>
        
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-8">
          <div className="flex flex-wrap items-center gap-2 mb-4 sm:mb-6">
            <span className="px-2.5 sm:px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider rounded-full">
              {service.category}
            </span>
            {service.sector && service.sector !== service.category && (
              <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-full">
                {service.sector}
              </span>
            )}
          </div>
          
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-slate-900 mb-4 leading-tight">
            {service.serviceName}
          </h1>
          
          <div className="flex flex-wrap items-center gap-2 text-slate-600 mb-8 text-sm">
            <Link href={`/services/list?q=${encodeURIComponent(service.startupName || '')}`} className="flex items-center gap-1.5 font-medium text-slate-900 hover:text-[#0A2164] hover:underline">
              <Building2 className="w-4 h-4 text-slate-400" />
              {service.startupName}
            </Link>
            {service.district && (
              <>
                <span className="text-slate-300 mx-1">•</span>
                <span className="flex items-center gap-1 text-slate-500">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {service.district}
                </span>
              </>
            )}
            {service.ksumUid && (
              <>
                <span className="text-slate-300 mx-1">•</span>
                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
                  {service.ksumUid}
                </span>
              </>
            )}
          </div>
          
          <div className="prose prose-slate max-w-none mb-8">
            <h2 className="text-lg font-semibold mb-3 text-slate-900">About this Service</h2>
            <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
              {service.description || 'No detailed description available.'}
            </p>
          </div>

          {/* Key Instrumentation & Equipment Used */}
          {service.equipmentUsed && service.equipmentUsed.length > 0 && (
            <div className="mb-8 p-5 bg-slate-50/80 rounded-xl border border-slate-100">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Microscope className="w-4 h-4 text-[#1b60bb]" />
                Equipment & Testing Capabilities Available
              </h3>
              <div className="flex flex-wrap gap-2">
                {service.equipmentUsed.map((equip, idx) => (
                  <span 
                    key={idx}
                    className="px-2.5 py-1 bg-white border border-slate-200 text-slate-700 text-xs font-medium rounded-md shadow-2xs"
                  >
                    {equip}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {service.infrastructure && (
              <div className="p-4 bg-white border border-slate-100 rounded-xl">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#1b60bb]" />
                  Infrastructure
                </h3>
                <p className="text-slate-700 text-sm font-medium leading-relaxed">{service.infrastructure}</p>
              </div>
            )}
            {service.certifications && (
              <div className="p-4 bg-white border border-slate-100 rounded-xl">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Certifications & Standards
                </h3>
                <p className="text-slate-700 text-sm font-medium leading-relaxed">{service.certifications}</p>
              </div>
            )}
          </div>
          
          <div className="border-t border-slate-100 pt-8 mt-8">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Contact Startup</h3>
            <div className="flex flex-col gap-2 text-slate-600 text-sm">
              {service.email && (
                <div className="flex items-center gap-2">
                  <span className="font-medium text-slate-700">Email:</span>
                  <a href={`mailto:${service.email}`} className="text-blue-600 hover:underline">{service.email}</a>
                </div>
              )}
              {service.phone && (
                <div className="flex items-center gap-2">
                  <span className="font-medium text-slate-700">Phone:</span>
                  <span>{service.phone}</span>
                </div>
              )}
              {service.address && (
                <div className="flex items-start gap-2 mt-1">
                  <span className="font-medium text-slate-700 flex-shrink-0">Address:</span>
                  <span className="text-slate-600 whitespace-pre-line">{service.address}</span>
                </div>
              )}
            </div>
            
            {service.bookingUrl && (
              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href={service.bookingUrl.startsWith('http://') || service.bookingUrl.startsWith('https://') ? service.bookingUrl : `https://${service.bookingUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-6 py-3 bg-[#0A2164] text-white font-semibold rounded-lg hover:bg-blue-900 transition-colors shadow-sm"
                >
                  Visit Website <ExternalLink className="w-4 h-4 ml-2" />
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
