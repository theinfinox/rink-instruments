export interface Instrument {
  id?: string; // Implicit or generated
  instruments: string;
  instruments1?: string;
  search_instruments?: string;
  search_instruments1?: string;
  acronym: string;
  image_link: string;
  original_image_link?: string;
  district: string;
  name_of_facility: string;
  institution_name: string;
  matched_institution?: string;
  institution_id?: string;
  match_score?: string;
  address: string;
  enquiry_contact_number: string;
  enquiry_mail: string;
  website_booking_link: string;
  website_booking_link_fallback: string;
  standardized_district: string;
  tag: string | string[];
  provider_key: string;
  warnings?: string;
}