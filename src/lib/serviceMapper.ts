import { Service } from '@/types/service';

export function mapService(raw: any): Service {
  return {
    id: undefined, // Backend does not provide stable IDs yet
    startupName: raw.startup_name || 'Unknown Startup',
    ksumUid: raw.ksum_uid || '',
    serviceName: raw.column_12 || 'Unnamed Service',
    description: raw.column_13 || '',
    category: raw.services_details || '',
    sector: raw.sector_domain || '',
    keywords: raw.column_14 ? raw.column_14.split(',').map((k: string) => k.trim()).filter(Boolean) : [],
    certifications: raw.column_15 || '',
    infrastructure: raw.column_16 || '',
    thumbnail: raw.upload_the_startup_logo_png_format || '/images/default-service.png',
    originalLogoUrl: raw.original_upload_the_startup_logo_png_format || '',
    district: raw.district || '',
    email: raw.enquiry_e_mail_address || '',
    phone: raw.enquiry_phone_number || '',
    bookingUrl: raw.booking_link_or_official_website || '',
    bookingFee: '', // Not provided currently, but reserved
    pricingModel: '', // Not provided currently, but reserved
    bookingType: 'Reserve now', // Default reserved type
  };
}

export function mapServices(rawData: any[]): Service[] {
  if (!Array.isArray(rawData)) return [];
  return rawData.map(mapService);
}
