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
        this.bySlug.set(inst.slug.toLowerCase(), inst);
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
    return this.bySlug.get(cleanSlug);
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
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
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

    return instrument.institution_name || instrument.matched_institution || 'Research Institution';
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

    // 1. First populate from official institution_list array (authoritative metadata source)
    institutionList.forEach(raw => {
      const id = raw.institution_id;
      const name = raw.institution_name || raw.matched_institution || '';
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      if (id) {
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
        });
      }
    });

    // 2. Count instruments and add any fallback institutions present in main_data
    mainData.forEach(inst => {
      const id = inst.institution_id;
      const name = inst.institution_name || inst.matched_institution || '';
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

      if (id) {
        if (!institutionMap.has(id)) {
          institutionMap.set(id, {
            institution_id: id,
            slug,
            name,
            tech_count: 0,
            has_verified_mou: mouMap.get(id) === true,
            address: inst.address !== 'None' ? inst.address : undefined,
            contact_email: inst.enquiry_mail !== 'None' ? inst.enquiry_mail : undefined,
            contact_phone: inst.enquiry_contact_number !== 'None' ? inst.enquiry_contact_number : undefined,
            website: inst.website_booking_link !== 'None' ? inst.website_booking_link : undefined,
          });
        }
        institutionMap.get(id)!.tech_count++;
      } else if (name) {
        // Fallback for unassigned institution_id
        const fallbackId = `fallback-${slug}`;
        if (!institutionMap.has(fallbackId)) {
          institutionMap.set(fallbackId, {
            institution_id: fallbackId,
            slug,
            name,
            tech_count: 0,
            has_verified_mou: false,
            address: inst.address !== 'None' ? inst.address : undefined,
          });
        }
        institutionMap.get(fallbackId)!.tech_count++;
      }
    });

    const repo = new InstitutionRepository(Array.from(institutionMap.values()));
    InstitutionRepository.setGlobal(repo);
    return repo;
  }

  getAll(): Institution[] {
    return Array.from(this.byId.values()).sort((a, b) => b.tech_count - a.tech_count);
  }
}
