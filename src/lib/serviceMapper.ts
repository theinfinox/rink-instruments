import { Service } from '@/types/service';
import { getImageUrl } from '@/lib/utils';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapService(raw: any): Service {
  const equipment = raw.column_14 
    ? raw.column_14.split(/[,;\n]+/).map((k: string) => k.trim()).filter(Boolean)
    : (raw.equipment_used ? (Array.isArray(raw.equipment_used) ? raw.equipment_used : raw.equipment_used.split(/[,;\n]+/).map((k: string) => k.trim()).filter(Boolean)) : []);

  const rawLogo = raw.logo_link || raw.upload_the_startup_logo_png_format || '';
  const cleanLogo = rawLogo && rawLogo !== 'None' ? getImageUrl(rawLogo.trim()) : '';

  const rawPhoto = raw.image_link || raw.service_image || raw.thumbnail || '';
  const cleanPhoto = rawPhoto && rawPhoto !== 'None' ? getImageUrl(rawPhoto.trim()) : '';

  return {
    id: raw.id || undefined,
    startupName: raw.startup_name || 'Unknown Startup',
    ksumUid: raw.ksum_uid || '',
    serviceName: raw.service_name || raw.column_12 || 'Unnamed Service',
    description: raw.description || raw.column_13 || '',
    category: raw.category || raw.services_details || '',
    sector: raw.sector || raw.sector_domain || '',
    keywords: equipment,
    equipmentUsed: equipment,
    certifications: raw.certifications || raw.column_15 || '',
    infrastructure: raw.infrastructure || raw.column_16 || '',
    thumbnail: cleanPhoto || cleanLogo,
    logo: cleanLogo,
    originalLogoUrl: raw.original_upload_the_startup_logo_png_format || raw.original_logo_link || '',
    originalThumbnailUrl: raw.original_image_link || raw.original_thumbnail || '',
    district: raw.district || '',
    address: raw.address || '',
    email: raw.enquiry_e_mail_address || '',
    phone: raw.enquiry_phone_number || '',
    bookingUrl: raw.booking_link_or_official_website || '',
    bookingFee: '', // Not provided currently, but reserved
    pricingModel: '', // Not provided currently, but reserved
    bookingType: 'Reserve now', // Default reserved type
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapServices(rawData: any[]): Service[] {
  if (!Array.isArray(rawData)) return [];
  return rawData.map(mapService);
}
