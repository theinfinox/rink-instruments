export interface Service {
  // We don't have a stable unique ID per service from the backend yet, 
  // but we should define it for when it arrives.
  id?: string;
  
  // Startup Info
  startupName: string;
  ksumUid: string;
  
  // Service Info
  serviceName: string;
  description: string;
  category: string;
  sector: string;
  keywords: string[];
  equipmentUsed?: string[];
  certifications: string;
  infrastructure: string;
  
  // Media
  thumbnail: string;
  originalLogoUrl?: string;
  
  // Contact & Location
  district: string;
  address?: string;
  email: string;
  phone: string;
  
  // Booking (Optional / Reserved for future)
  bookingUrl?: string;
  bookingFee?: string;
  pricingModel?: string;
  bookingType?: string; // e.g. "Reserve now"
}
