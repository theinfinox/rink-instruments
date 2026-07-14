export interface Action {
  label: string;
  href: string;
  type: 'booking' | 'website' | 'email' | 'phone' | 'map';
}

export interface InstrumentViewModel {
  /** The unique identifier (from provider_key or generated) */
  id: string;

  /** The display title (e.g., formatted instrument name) */
  title: string;

  /** The acronym, if any (and valid) */
  acronym: string | null;
  
  /** A pre-formatted string combining title and acronym */
  displayTitle: string;

  /** The name of the institution owning the instrument */
  institution: string;

  /** Optional facility name within the institution */
  facility: string | null;

  location: {
    district: string;
    address: string | null;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
    mapUrl?: string | null;
  };

  media: {
    thumbnail: string | null;
    gallery: string[];
  };

  contact: {
    phone: string | null;
    email: string | null;
    website: string | null;
  };

  actions: {
    primary: Action | null;
    secondary: Action[];
    overflow: Action[];
  };

  /** Formatted array of research areas / tags */
  tags: string[];

  ui: {
    hasImage: boolean;
    hasBooking: boolean;
    hasContact: boolean;
    hasLocation: boolean;
    canShare: boolean;
  };
}
