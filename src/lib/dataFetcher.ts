import { CDN_HOST } from '@/lib/utils';
import { Instrument } from '@/types/instrument';
import { Service } from '@/types/service';
import { mapServices } from '@/lib/serviceMapper';

export type DatasetType = 'instruments' | 'services';

export interface InstrumentBundle {
  main_data: Instrument[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  instituitiion_list: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  subsidized_list: any[];
}

export async function fetchInstrumentBundle(): Promise<InstrumentBundle> {
  try {
    const res = await fetch(`${CDN_HOST}/instrument.json`);
    if (!res.ok) return { main_data: [], instituitiion_list: [], subsidized_list: [] };
    const data = await res.json();
    const main_data: Instrument[] = data.main_data || [];
    const instituitiion_list = data.instituitiion_list || data.institution_list || [];
    const subsidized_list = data.subsidized || [];
    return { main_data, instituitiion_list, subsidized_list };
  } catch (error) {
    console.error("Failed to fetch instrument bundle:", error);
    return { main_data: [], instituitiion_list: [], subsidized_list: [] };
  }
}

export async function fetchDataset(type: 'instruments'): Promise<Instrument[]>;
export async function fetchDataset(type: 'services'): Promise<Service[]>;
export async function fetchDataset(type: DatasetType): Promise<Instrument[] | Service[]>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function fetchDataset(type: DatasetType): Promise<any[]> {
  try {
    if (type === 'instruments') {
      const res = await fetch(`${CDN_HOST}/instrument.json`);
      if (!res.ok) return [];
      const data = await res.json();
      return data.main_data || [];
    } else if (type === 'services') {
      const res = await fetch(`${CDN_HOST}/services.json`);
      if (!res.ok) return [];
      const data = await res.json();
      return mapServices(data.main_services || []);
    }
  } catch (error) {
    console.error(`Failed to fetch dataset (${type}):`, error);
  }
  return [];
}

export async function fetchDistrictTaxonomy(): Promise<string[]> {
  try {
    // 1. Try services filters.json if available
    const svcRes = await fetch(`${CDN_HOST}/api/services/filters.json`).catch(() => null);
    if (svcRes && svcRes.ok) {
      const data = await svcRes.json();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const districtCat = data.find((c: any) => c.id === 'district' || c.id === 'standardized_district');
      if (districtCat?.groups) {
        const districts = Object.values(districtCat.groups).flat() as string[];
        if (districts.length > 0) {
          return Array.from(new Set(districts)).filter(Boolean);
        }
      }
    }

    // 2. Fallback to instrument filters.json (maintained in sheets.yaml filterTaxonomy)
    const instRes = await fetch(`${CDN_HOST}/api/instrument/filters.json`).catch(() => null);
    if (instRes && instRes.ok) {
      const data = await instRes.json();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const districtCat = data.find((c: any) => c.id === 'standardized_district' || c.id === 'district');
      if (districtCat?.groups) {
        const districts = Object.values(districtCat.groups).flat() as string[];
        if (districts.length > 0) {
          return Array.from(new Set(districts)).filter(Boolean);
        }
      }
    }
  } catch (error) {
    console.error("Failed to fetch district taxonomy from backend:", error);
  }

  // 3. Resilient fallback to 14 Kerala districts if offline
  return [
    'Thiruvananthapuram', 'Kollam', 'Pathanamthitta', 'Alappuzha',
    'Kottayam', 'Idukki', 'Ernakulam', 'Thrissur',
    'Palakkad', 'Malappuram', 'Kozhikode', 'Wayanad',
    'Kannur', 'Kasaragod'
  ];
}
