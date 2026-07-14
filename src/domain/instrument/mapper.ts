import { Instrument } from '@/types/instrument';
import { InstrumentViewModel, Action } from './view-model';
import { getImageUrl } from '@/lib/utils';

function mapLocation(instrument: Instrument): InstrumentViewModel['location'] {
  const addressStr = instrument.address && instrument.address !== 'None' ? instrument.address : '';
  const query = encodeURIComponent(`${instrument.institution_name} ${addressStr}`.trim());
  
  return {
    district: instrument.standardized_district,
    address: addressStr || null,
    // coordinates are not currently provided by backend, leaving room for future expansion
    coordinates: undefined,
    mapUrl: `https://www.google.com/maps/search/?api=1&query=${query}`,
  };
}

function mapMedia(instrument: Instrument): InstrumentViewModel['media'] {
  const thumbnail = instrument.image_link ? getImageUrl(instrument.image_link) : null;
  return {
    thumbnail,
    gallery: thumbnail ? [thumbnail] : [], // future proofing for gallery array
  };
}

function mapContact(instrument: Instrument): InstrumentViewModel['contact'] {
  const phone = instrument.enquiry_contact_number && instrument.enquiry_contact_number !== 'None' ? instrument.enquiry_contact_number : null;
  const email = instrument.enquiry_mail && instrument.enquiry_mail !== 'None' ? instrument.enquiry_mail : null;
  
  // Try to use a fallback link for website if booking isn't available
  const website = instrument.website_booking_link_fallback && instrument.website_booking_link_fallback !== 'None' 
    ? instrument.website_booking_link_fallback 
    : null;

  return { phone, email, website };
}

function mapActions(instrument: Instrument, contact: InstrumentViewModel['contact']): InstrumentViewModel['actions'] {
  const actions: InstrumentViewModel['actions'] = {
    primary: null,
    secondary: [],
    overflow: [],
  };

  const bookingUrl = instrument.website_booking_link && instrument.website_booking_link !== 'None' 
    ? instrument.website_booking_link 
    : null;

  if (bookingUrl) {
    actions.primary = {
      label: 'Book Instrument',
      href: bookingUrl,
      type: 'booking',
    };
  } else if (contact.website) {
    actions.primary = {
      label: 'Visit Website',
      href: contact.website,
      type: 'website',
    };
  } else if (contact.email) {
    actions.primary = {
      label: 'Contact Institution',
      href: `mailto:${contact.email}`,
      type: 'email',
    };
  }

  // Populate secondary actions if they exist and aren't the primary action
  if (contact.email && actions.primary?.type !== 'email') {
    actions.secondary.push({
      label: 'Email',
      href: `mailto:${contact.email}`,
      type: 'email',
    });
  }

  if (contact.phone && actions.primary?.type !== 'phone') {
    actions.secondary.push({
      label: 'Call',
      href: `tel:${contact.phone}`,
      type: 'phone',
    });
  }

  if (contact.website && actions.primary?.type !== 'website') {
    actions.secondary.push({
      label: 'Website',
      href: contact.website,
      type: 'website',
    });
  }

  const location = mapLocation(instrument);
  if (location.mapUrl) {
    actions.secondary.push({
      label: 'Open in Maps',
      href: location.mapUrl,
      type: 'map',
    });
  }

  return actions;
}

export function toInstrumentViewModel(instrument: Instrument): Readonly<InstrumentViewModel> {
  const id = instrument.provider_key || instrument.id || '';
  const title = instrument.instruments;
  const acronym = instrument.acronym && instrument.acronym !== 'None' ? instrument.acronym : null;
  const displayTitle = acronym ? `${title} (${acronym})` : title;
  
  const facility = instrument.name_of_facility && instrument.name_of_facility !== 'None' ? instrument.name_of_facility : null;
  
  let tags: string[] = [];
  if (Array.isArray(instrument.tag)) {
    tags = instrument.tag.filter(t => t !== 'None');
  } else if (instrument.tag && instrument.tag !== 'None') {
    tags = [instrument.tag];
  }

  const location = mapLocation(instrument);
  const media = mapMedia(instrument);
  const contact = mapContact(instrument);
  const actions = mapActions(instrument, contact);

  return Object.freeze({
    id,
    title,
    acronym,
    displayTitle,
    institution: instrument.institution_name,
    facility,
    location,
    media,
    contact,
    actions,
    tags,
    ui: {
      hasImage: Boolean(media.thumbnail),
      hasBooking: Boolean(actions.primary?.type === 'booking'),
      hasContact: Boolean(contact.phone || contact.email || contact.website),
      hasLocation: Boolean(location.district),
      canShare: true,
    }
  });
}
