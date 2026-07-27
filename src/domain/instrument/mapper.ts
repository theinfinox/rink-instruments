import { Instrument } from '@/types/instrument';
import { InstrumentViewModel } from './view-model';
import { getImageUrl } from '@/lib/utils';
import { InstitutionRepository } from '@/repositories/InstitutionRepository';

function mapLocation(instrument: Instrument, repo?: InstitutionRepository): InstrumentViewModel['location'] {
  const activeRepo = repo || InstitutionRepository.getGlobal() || undefined;
  const instEntity = activeRepo ? (activeRepo.getById(instrument.institution_id) || activeRepo.getByName(instrument.institution_name)) : undefined;
  
  const addressStr = instEntity?.address || (instrument.address && instrument.address !== 'None' ? instrument.address : null);
  
  let coordinates: InstrumentViewModel['location']['coordinates'] = undefined;
  if (instEntity?.latitude && instEntity?.longitude) {
    const lat = parseFloat(instEntity.latitude);
    const lng = parseFloat(instEntity.longitude);
    if (!isNaN(lat) && !isNaN(lng)) {
      coordinates = { latitude: lat, longitude: lng };
    }
  }

  let mapUrl: string | null = null;
  if (instEntity?.link) {
    mapUrl = instEntity.link;
  } else if (coordinates) {
    mapUrl = `https://www.google.com/maps?q=${coordinates.latitude},${coordinates.longitude}`;
  } else {
    const instName = activeRepo ? activeRepo.resolveDisplayName(instrument) : (instrument.institution_name || instrument.matched_institution || '');
    const query = encodeURIComponent(`${instName} ${addressStr || ''}`.trim());
    mapUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;
  }
  
  return {
    district: instrument.standardized_district || instrument.district,
    address: addressStr,
    coordinates,
    mapUrl,
  };
}

function mapMedia(instrument: Instrument): InstrumentViewModel['media'] {
  const thumbnail = instrument.image_link ? getImageUrl(instrument.image_link) : null;
  return {
    thumbnail,
    gallery: thumbnail ? [thumbnail] : [],
  };
}

function mapContact(instrument: Instrument, repo?: InstitutionRepository): InstrumentViewModel['contact'] {
  const activeRepo = repo || InstitutionRepository.getGlobal() || undefined;
  const instEntity = activeRepo ? (activeRepo.getById(instrument.institution_id) || activeRepo.getByName(instrument.institution_name)) : undefined;

  const phone = instEntity?.contact_phone || (instrument.enquiry_contact_number && instrument.enquiry_contact_number !== 'None' ? instrument.enquiry_contact_number : null);
  const email = instEntity?.contact_email || (instrument.enquiry_mail && instrument.enquiry_mail !== 'None' ? instrument.enquiry_mail : null);
  const website = instEntity?.website || (instrument.website_booking_link_fallback && instrument.website_booking_link_fallback !== 'None' ? instrument.website_booking_link_fallback : null);

  return { phone, email, website };
}

function mapActions(
  instrument: Instrument, 
  contact: InstrumentViewModel['contact'],
  location: InstrumentViewModel['location']
): InstrumentViewModel['actions'] {
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

  if (location.mapUrl) {
    actions.secondary.push({
      label: 'Open in Maps',
      href: location.mapUrl,
      type: 'map',
    });
  }

  return actions;
}

export function toInstrumentViewModel(
  instrument: Instrument,
  repo?: InstitutionRepository
): Readonly<InstrumentViewModel> {
  const activeRepo = repo || InstitutionRepository.getGlobal() || undefined;

  const id = instrument.provider_key || instrument.id || '';
  const title = instrument.instruments;
  const acronym = instrument.acronym && instrument.acronym !== 'None' ? instrument.acronym : null;
  const displayTitle = acronym ? `${title} (${acronym})` : title;
  
  const institutionName = activeRepo 
    ? activeRepo.resolveDisplayName(instrument)
    : (instrument.institution_name || instrument.matched_institution || '');
    
  const facility = instrument.name_of_facility && instrument.name_of_facility !== 'None' ? instrument.name_of_facility : null;
  
  let tags: string[] = [];
  if (Array.isArray(instrument.tag)) {
    tags = instrument.tag.filter(t => t !== 'None');
  } else if (instrument.tag && instrument.tag !== 'None') {
    tags = [instrument.tag];
  }

  const location = mapLocation(instrument, activeRepo);
  const media = mapMedia(instrument);
  const contact = mapContact(instrument, activeRepo);
  const actions = mapActions(instrument, contact, location);

  return Object.freeze({
    id,
    title,
    acronym,
    displayTitle,
    institution: institutionName,
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
