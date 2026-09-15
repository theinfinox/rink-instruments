import { Institution } from '@/types';
import { Instrument } from '@/types/instrument';

let _globalRepo: InstitutionRepository | null = null;

export class InstitutionRepository {
  private byId = new Map<string, Institution>();
  private bySlug = new Map<string, Institution>();
  private byName = new Map<string, Institution>();

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
    const rawName = (instrument.institution_name || instrument.matched_institution || rawInst.institution || '').trim();
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
    mouList: any[] = []
  ): InstitutionRepository {
    const institutionMap = new Map<string, Institution>();
    const mouMap = new Map<string, boolean>();

    // 0. Build O(1) MoU lookup map indexed ONLY by institution_id
    if (Array.isArray(mouList)) {
      mouList.forEach(raw => {
        if (raw?.institution_id && raw?.verification_status === 'Verified') {
          mouMap.set(raw.institution_id, true);
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
        institutionMap.set(id, {
          institution_id: id,
          slug,
          name,
          tech_count: 0,
          has_verified_mou: mouMap.get(id) === true,
          latitude: raw.latitude,
          longitude: raw.longitude,
          link: raw.link,
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
          institutionMap.get(id)!.tech_count++;
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
              address: inst.address !== 'None' ? inst.address : undefined,
              is_partner_institute: false,
              entity_type: entityType,
              is_startup: isStartup,
              ksum_uid: inst.ksum_uid,
              district: inst.district,
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

    const repo = new InstitutionRepository(Array.from(institutionMap.values()));
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
