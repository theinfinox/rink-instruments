import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Building2, ExternalLink, ChevronRight } from 'lucide-react';
import { fetchDataset } from '@/lib/dataFetcher';
import { Service } from '@/types/service';

export const dynamicParams = true;

export async function generateStaticParams() {
  const services: Service[] = await fetchDataset('services');
  return services.map(s => ({ id: s.id || s.serviceName }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const decodedId = decodeURIComponent(id);
  const services: Service[] = await fetchDataset('services');
  const service = services.find(s => (s.id || s.serviceName) === decodedId);
  
  if (!service) return { title: 'Service Not Found — RINK' };
  
  return {
    title: `${service.serviceName} | ${service.startupName} — RINK Services`,
    description: service.description || `Research service offered by ${service.startupName}.`,
  };
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const decodedId = decodeURIComponent(id);
  
  const services: Service[] = await fetchDataset('services');
  const service = services.find(s => (s.id || s.serviceName) === decodedId);

  if (!service) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <nav className="flex items-center gap-1.5 text-xs text-slate-500 flex-wrap mb-4">
          <Link href="/" className="hover:text-[#0A2164] transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3 text-slate-300" />
          <Link href="/services/list" className="hover:text-[#0A2164] transition-colors">Services</Link>
          {service.category && (
            <>
              <ChevronRight className="w-3 h-3 text-slate-300" />
              <Link 
                href={`/services/list?category=${encodeURIComponent(service.category)}`}
                className="hover:text-[#0A2164] transition-colors"
              >
                {service.category}
              </Link>
            </>
          )}
          <ChevronRight className="w-3 h-3 text-slate-300" />
          <span className="text-slate-900 font-medium truncate max-w-[200px] sm:max-w-sm">{service.serviceName}</span>
        </nav>

        <Link href="/services/list" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-[#0A2164] transition-colors mb-6">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Services
        </Link>
        
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider rounded-full">
              {service.category}
            </span>
          </div>
          
          <h1 className="text-3xl font-heading font-bold text-slate-900 mb-4">
            {service.serviceName}
          </h1>
          
          <div className="flex items-center gap-2 text-slate-600 mb-8">
            <Building2 className="w-5 h-5 text-slate-400" />
            <span className="font-medium text-slate-900">{service.startupName}</span>
            <span className="text-slate-300 mx-2">•</span>
            <span>{service.district}</span>
          </div>
          
          <div className="prose prose-slate max-w-none mb-10">
            <h2 className="text-xl font-semibold mb-3 text-slate-900">About this Service</h2>
            <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
              {service.description || 'No detailed description available.'}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            {service.infrastructure && (
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">Infrastructure</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{service.infrastructure}</p>
              </div>
            )}
            {service.certifications && (
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">Certifications</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{service.certifications}</p>
              </div>
            )}
          </div>
          
          <div className="border-t border-slate-100 pt-8 mt-8">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Contact Startup</h3>
            <div className="flex flex-col gap-2 text-slate-600">
              {service.email && (
                <div className="flex items-center gap-2">
                  <span className="font-medium">Email:</span>
                  <a href={`mailto:${service.email}`} className="text-blue-600 hover:underline">{service.email}</a>
                </div>
              )}
              {service.phone && (
                <div className="flex items-center gap-2">
                  <span className="font-medium">Phone:</span>
                  <span>{service.phone}</span>
                </div>
              )}
            </div>
            
            <div className="mt-8 flex gap-4">
              <a
                href={service.bookingUrl || `mailto:${service.email}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 bg-[#0A2164] text-white font-semibold rounded-lg hover:bg-blue-900 transition-colors"
              >
                {service.bookingType || 'Inquire Now'}
              </a>
              {service.bookingUrl && (
                <a
                  href={service.bookingUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center px-6 py-3 bg-white text-slate-700 border border-slate-200 font-semibold rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Visit Website <ExternalLink className="w-4 h-4 ml-2" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
