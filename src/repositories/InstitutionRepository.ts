import { Institution } from '@/types';
import { Instrument, SubsidizedClaimPolicy } from '@/types/instrument';

let _globalRepo: InstitutionRepository | null = null;

export class InstitutionRepository {
  private byId = new Map<string, Institution>();
  private bySlug = new Map<string, Institution>();
  private byName = new Map<string, Institution>();
  private subsidizedPolicies = new Map<string, SubsidizedClaimPolicy>();

  constructor(institutions: Institution[]) {
    institutions.forEach(inst => {
      if (inst.institution_id) {
        this.byId.set(inst.institution_id, inst);
      }
      if (inst.slug) {
        const cleanSlug = inst.slug.toLowerCase().trim();
        this.bySlug.set(cleanSlug, inst);
        const strippedSlug = cleanSlug.replace(/^-+|-+$/g, '');
        if (strippedSlug && strippedSlug !== cleanSlug) {
          this.bySlug.set(strippedSlug, inst);
        }
      }
      if (inst.name) {
        this.byName.set(inst.name.toLowerCase().trim(), inst);
      }
    });
  }

  static setGlobal(repo: InstitutionRepository) {
    _globalRepo = repo;
  }

  static getGlobal(): InstitutionRepository | null {
    return _globalRepo;
  }

  getAllInstitutions(): Institution[] {
    return Array.from(this.byId.values());
  }

  getById(id?: string | null): Institution | undefined {
    if (!id) return undefined;
    const inst = this.byId.get(id);
    if (!inst && process.env.NODE_ENV !== 'production') {
      console.warn(`[InstitutionRepository] Institution ID "${id}" could not be resolved in repository.`);
    }
    return inst;
  }

  getBySlug(slug?: string | null): Institution | undefined {
    if (!slug) return undefined;
    const cleanSlug = slug.toLowerCase().trim();
    return this.bySlug.get(cleanSlug) || this.bySlug.get(cleanSlug.replace(/^-+|-+$/g, ''));
  }

  getByName(name?: string | null): Institution | undefined {
    if (!name) return undefined;
    const cleanName = name.toLowerCase().trim();
    return this.byName.get(cleanName);
  }

  setSubsidizedPolicies(policies: Map<string, SubsidizedClaimPolicy>) {
    this.subsidizedPolicies = policies;
  }

  getSubsidizedPolicy(instOrId?: Instrument | string | null): SubsidizedClaimPolicy | null {
    if (!instOrId) return null;
    let id: string | undefined;
    if (typeof instOrId === 'string') {
      id = instOrId;
    } else {
      const inst = this.getInstitution(instOrId);
      id = inst?.institution_id || instOrId.institution_id;
    }
    if (id && this.subsidizedPolicies.has(id)) {
      return this.subsidizedPolicies.get(id) || null;
    }
    return null;
  }

  /**
   * Centralized Institution Entity Resolver
   * Resolves the canonical Institution object for an instrument via institution_id
   * with fallback to legacy fields if unmapped.
   */
  getInstitution(instrument: Instrument): Institution {
    if (instrument.institution_id) {
      const inst = this.getById(instrument.institution_id);
      if (inst) return inst;
    }

    const name = this.resolveDisplayName(instrument);
    const slug = name.toLowerCase().replace(/['’]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    const existing = this.getBySlug(slug) || this.getByName(name);
    if (existing) return existing;

    return {
      institution_id: instrument.institution_id || `fallback-${slug}`,
      slug,
      name,
      tech_count: 1,
      has_verified_mou: false,
      address: instrument.address !== 'None' ? instrument.address : undefined,
    };
  }

  /**
   * Canonical Display Name Resolver
   * Resolves: instrument.institution_id -> Institution Dataset -> institution_name
   * Fallback 1: instrument.institution_name
   * Fallback 2: instrument.matched_institution
   */
  resolveDisplayName(instrument: Instrument): string {
    if (instrument.institution_id) {
      const inst = this.getById(instrument.institution_id);
      if (inst?.name) return inst.name;
    }

    if (process.env.NODE_ENV !== 'production' && instrument.institution_id) {
      console.warn(`[InstitutionRepository] Fallback activated for unmapped institution_id: "${instrument.institution_id}"`);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rawInst = instrument as any;
    const rawName = String(instrument.institution_name || instrument.matched_institution || rawInst.institution || '').trim();
    if (rawName) {
      const slug = rawName.toLowerCase().replace(/['’]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      const entity = this.getBySlug(slug) || this.getByName(rawName);
      if (entity?.name) return entity.name;
      return rawName;
    }

    if (process.env.NODE_ENV !== 'production' && instrument.institution_id) {
      console.warn(`[InstitutionRepository] Fallback activated for unmapped institution_id: "${instrument.institution_id}"`);
    }

    return 'Research Institution';
  }

  getCoordinates(id?: string | null) {
    const inst = this.getById(id);
    if (inst && inst.latitude && inst.longitude) {
      return {
        latitude: inst.latitude,
        longitude: inst.longitude,
        mapUrl: inst.link || `https://www.google.com/maps?q=${inst.latitude},${inst.longitude}`,
      };
    }
    return undefined;
  }

  getProvider(id?: string | null): string | undefined {
    const inst = this.getById(id);
    return inst?.correct_provider_key;
  }

  /**
   * Factory method to build InstitutionRepository from raw instrument.json output
   * handles main_data, instituitiion_list, and mou tabs
   */
  static fromInstrumentData(
    mainData: Instrument[] = [],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    institutionList: any[] = [],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mouList: any[] = [],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    subsidizedList: any[] = []
  ): InstitutionRepository {
    const institutionMap = new Map<string, Institution>();
    const mouMap = new Map<string, boolean>();
    const subsidizedMap = new Map<string, SubsidizedClaimPolicy>();

    // 0. Build Subsidized Claim Policy map from live Subsidized sheet
    if (Array.isArray(subsidizedList) && subsidizedList.length > 0) {
      subsidizedList.forEach(raw => {
        const id = raw?.institution_id;
        if (id && (raw?.ksum_mou_status === 'Yes' || raw?.verification_status === 'Verified')) {
          mouMap.set(id, true);
          subsidizedMap.set(id, {
            hasSubsidizedRates: true,
            institutionId: id,
            institutionName: (raw.institution_name || '').trim(),
            benefitType: raw.benefit_type || undefined,
            discountOrRate: raw.discount_or_rate || undefined,
            eligibility: raw.eligibility || undefined,
            facilityOrCentre: raw.facility_or_centre || undefined,
            accessConditions: raw.access_conditions || undefined,
            validity: raw.validity && raw.validity !== 'Not Specified' ? raw.validity : undefined,
            applicationMethod: raw.application_method || undefined,
            referenceOrDocument: raw.reference_or_document || undefined,
            notes: raw.notes || undefined,
            description: raw.description || undefined,
            verificationStatus: raw.verification_status || undefined,
            facilityNameReference: raw.facility_name_reference || undefined,
            additionalPolicyDetails: raw.additional_policy_details || undefined,
            sourceUrl: raw.source_url && raw.source_url.startsWith('http') ? raw.source_url.trim() : null,
            applicationFormUrl: raw.application_form_url && raw.application_form_url.startsWith('http') ? raw.application_form_url.trim() : null,
          });
        }
      });
    }

    // 0b. Fallback / merge with legacy mouList
    if (Array.isArray(mouList)) {
      mouList.forEach(raw => {
        const id = raw?.institution_id;
        if (id && (raw?.ksum_mou === 'Yes' || raw?.verification_status === 'Verified')) {
          mouMap.set(id, true);
          if (!subsidizedMap.has(id)) {
            subsidizedMap.set(id, {
              hasSubsidizedRates: true,
              institutionId: id,
              institutionName: (raw.institution_name || '').trim(),
              benefitType: raw.ksum_benefit_type,
              discountOrRate: raw.ksum_discount_or_rate,
              eligibility: raw.ksum_eligible_for,
              facilityOrCentre: raw.ksum_facility,
              accessConditions: raw.ksum_conditions,
              validity: raw.ksum_validity && raw.ksum_validity !== 'Not Specified' ? raw.ksum_validity : undefined,
              applicationMethod: raw.ksum_application_method,
              description: raw.ksum_mou_details,
              verificationStatus: raw.verification_status,
              sourceUrl: null,
              applicationFormUrl: null,
            });
          }
        }
      });
    }

    const generateSlug = (rawName: string) =>
      rawName.toLowerCase().replace(/['’]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

    // 1. First populate from official institution_list array (authoritative metadata source)
    institutionList.forEach(raw => {
      const id = raw.institution_id;
      const name = (raw.institution_name || raw.matched_institution || '').trim();
      const slug = generateSlug(name);
      if (id && name) {
        const mapsLink = raw.gmaps_link || raw.link || (raw.latitude && raw.longitude ? `https://www.google.com/maps?q=${raw.latitude},${raw.longitude}` : undefined);
        institutionMap.set(id, {
          institution_id: id,
          slug,
          name,
          tech_count: 0,
          has_verified_mou: mouMap.get(id) === true,
          latitude: raw.latitude,
          longitude: raw.longitude,
          link: mapsLink,
          gmaps_link: mapsLink,
          plus_code: raw.plus_code,
          correct_provider_key: raw.correct_provider_key,
          reason_classification: raw.reason_classification,
          logo_link: raw.logo_link,
          original_logo_link: raw.original_logo_link,
          is_partner_institute: true,
          entity_type: 'research',
          is_startup: false,
        });
      }
    });

    // Helper map for fast deduplication by normalized slug
    const findExistingBySlugOrName = (slug: string, name: string) => {
      const cleanName = name.toLowerCase().trim();
      for (const inst of institutionMap.values()) {
        if (inst.slug === slug || inst.name.toLowerCase().trim() === cleanName) {
          return inst;
        }
      }
      return undefined;
    };

    // 2. Count instruments and add any fallback institutions present in main_data
    mainData.forEach(inst => {
      const id = inst.institution_id;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rawInst = inst as any;
      const name = (inst.institution_name || inst.matched_institution || rawInst.institution || '').trim();
      const slug = generateSlug(name);

      const isStartup =
        (inst.institution_type || rawInst.institution_type || '').toLowerCase() === 'startup' ||
        (rawInst.are_you_an_institution_startup || '').toLowerCase() === 'startup' ||
        (inst.source_type === 'intake_form' && (!id || !id.startsWith('INSTITUTE-')));
      const entityType: 'research' | 'startup' = isStartup ? 'startup' : 'research';

      if (id) {
        if (!institutionMap.has(id)) {
          if (name) {
            institutionMap.set(id, {
              institution_id: id,
              slug: slug || id.toLowerCase(),
              name,
              tech_count: 0,
              has_verified_mou: mouMap.get(id) === true,
              address: inst.address !== 'None' ? inst.address : undefined,
              contact_email: inst.enquiry_mail !== 'None' ? inst.enquiry_mail : undefined,
              contact_phone: inst.enquiry_contact_number !== 'None' ? inst.enquiry_contact_number : undefined,
              website: inst.website_booking_link !== 'None' ? inst.website_booking_link : undefined,
              is_partner_institute: id.startsWith('INSTITUTE-'),
              entity_type: entityType,
              is_startup: isStartup,
              ksum_uid: inst.ksum_uid,
              district: inst.district,
            });
          }
        }
        if (institutionMap.has(id)) {
          const existing = institutionMap.get(id)!;
          existing.tech_count++;
          if (!existing.district && inst.district) {
            existing.district = inst.district;
          }
          if (!existing.address && inst.address && inst.address !== 'None') {
            existing.address = inst.address;
          }
          if (!existing.contact_phone && inst.enquiry_contact_number && inst.enquiry_contact_number !== 'None') {
            existing.contact_phone = inst.enquiry_contact_number;
          }
          if (!existing.contact_email && inst.enquiry_mail && inst.enquiry_mail !== 'None') {
            existing.contact_email = inst.enquiry_mail;
          }
          if (!existing.website && inst.website_booking_link && inst.website_booking_link !== 'None') {
            existing.website = inst.website_booking_link;
          }
        }
      } else if (name) {
        // Check if an existing institution matches by slug or name
        const existing = findExistingBySlugOrName(slug, name);
        if (existing) {
          existing.tech_count++;
          if (isStartup) {
            existing.entity_type = 'startup';
            existing.is_startup = true;
          }
          if (inst.ksum_uid && !existing.ksum_uid) existing.ksum_uid = inst.ksum_uid;
          if (inst.district && !existing.district) existing.district = inst.district;
          if (inst.address && !existing.address && inst.address !== 'None') existing.address = inst.address;
          if (inst.enquiry_mail && !existing.contact_email && inst.enquiry_mail !== 'None') existing.contact_email = inst.enquiry_mail;
          if (inst.enquiry_contact_number && !existing.contact_phone && inst.enquiry_contact_number !== 'None') existing.contact_phone = inst.enquiry_contact_number;
          if (inst.website_booking_link && !existing.website && inst.website_booking_link !== 'None') existing.website = inst.website_booking_link;
        } else {
          // Fallback for unassigned institution_id (e.g. intake form submissions)
          const fallbackId = `fallback-${slug}`;
          if (!institutionMap.has(fallbackId)) {
            institutionMap.set(fallbackId, {
              institution_id: fallbackId,
              slug,
              name,
              tech_count: 0,
              has_verified_mou: false,
              is_partner_institute: false,
              entity_type: entityType,
              is_startup: isStartup,
              district: inst.district,
              address: inst.address !== 'None' ? inst.address : undefined,
              contact_email: inst.enquiry_mail !== 'None' ? inst.enquiry_mail : undefined,
              contact_phone: inst.enquiry_contact_number !== 'None' ? inst.enquiry_contact_number : undefined,
              website: inst.website_booking_link !== 'None' ? inst.website_booking_link : undefined,
              logo_link: (rawInst.logo_link && rawInst.logo_link !== 'None') ? rawInst.logo_link : undefined,
            });
          }
          institutionMap.get(fallbackId)!.tech_count++;
        }
      }
    });

    // 3. Fallback resolution for district and Google Maps links
    const PLUS_CODE_DISTRICTS: Record<string, string> = {
      'kochi': 'Ernakulam',
      'thiruvananthapuram': 'Trivandrum',
      'athirampuzha': 'Kottayam',
      'kanjikode': 'Palakkad',
      'kozhikode': 'Kozhikode',
      'palode': 'Trivandrum',
      'thonnakkal': 'Trivandrum',
      'peechi': 'Thrissur',
      'kalavoor': 'Alappuzha',
      'kattangal': 'Kozhikode',
      'neyyatinkara': 'Trivandrum',
      'chowki': 'Kasaragod',
      'thenhipalam': 'Malappuram',
      'mannuthy': 'Thrissur',
      'vithura': 'Trivandrum',
      'aakkulam': 'Trivandrum',
      'meppadi': 'Wayanad',
      'mundakkal': 'Kollam'
    };

    for (const inst of institutionMap.values()) {
      if (!inst.district || inst.district === 'None') {
        const textToSearch = `${inst.plus_code || ''} ${inst.address || ''} ${inst.name || ''}`.toLowerCase();
        for (const [key, dist] of Object.entries(PLUS_CODE_DISTRICTS)) {
          if (textToSearch.includes(key)) {
            inst.district = dist;
            break;
          }
        }
        if (!inst.district) {
          inst.district = 'Kerala';
        }
      }

      if (!inst.gmaps_link && !inst.link) {
        if (inst.latitude && inst.longitude) {
          inst.gmaps_link = `https://www.google.com/maps?q=${inst.latitude},${inst.longitude}`;
          inst.link = inst.gmaps_link;
        } else if (inst.address && inst.address !== 'None') {
          inst.gmaps_link = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(inst.address)}`;
          inst.link = inst.gmaps_link;
        } else if (inst.district) {
          inst.gmaps_link = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${inst.name}, ${inst.district}, Kerala`)}`;
          inst.link = inst.gmaps_link;
        }
      }
    }

    const repo = new InstitutionRepository(Array.from(institutionMap.values()));
    repo.setSubsidizedPolicies(subsidizedMap);
    InstitutionRepository.setGlobal(repo);
    return repo;
  }

  getAll(): Institution[] {
    return Array.from(this.byId.values())
      .filter(inst => inst.name && inst.name.trim() !== '' && inst.slug && inst.slug.trim() !== '')
      .sort((a, b) => (a.name || '').trim().localeCompare((b.name || '').trim(), undefined, { sensitivity: 'base' }));
  }

  getPartnerInstitutions(): Institution[] {
    return this.getAll()
      .filter(inst => inst.is_partner_institute === true);
  }

  getResearchInstitutions(): Institution[] {
    return this.getAll()
      .filter(inst => !inst.is_startup && (inst.entity_type === 'research' || inst.is_partner_institute === true));
  }

  getStartupInstitutions(): Institution[] {
    return this.getAll()
      .filter(inst => inst.entity_type === 'startup' || inst.is_startup === true);
  }
}
