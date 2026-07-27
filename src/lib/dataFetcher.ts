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
  mou_list: any[];
}

export async function fetchInstrumentBundle(): Promise<InstrumentBundle> {
  try {
    const res = await fetch(`${CDN_HOST}/instrument.json`);
    if (!res.ok) return { main_data: [], instituitiion_list: [], mou_list: [] };
    const data = await res.json();
    const main_data: Instrument[] = data.main_data || [];
    const instituitiion_list = data.instituitiion_list || data.institution_list || [];
    const mou_list = data.mou || [];
    return { main_data, instituitiion_list, mou_list };
  } catch (error) {
    console.error("Failed to fetch instrument bundle:", error);
    return { main_data: [], instituitiion_list: [], mou_list: [] };
  }
}

export async function fetchDataset(type: 'instruments'): Promise<Instrument[]>;
export async function fetchDataset(type: 'services'): Promise<Service[]>;
export async function fetchDataset(type: DatasetType): Promise<Instrument[] | Service[]>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function fetchDataset(type: DatasetType): Promise<any[]> {
  if (type === 'instruments') {
    const res = await fetch(`${CDN_HOST}/instrument.json`);
    const data = await res.json();
    return data.main_data || [];
  } else if (type === 'services') {
    const res = await fetch(`${CDN_HOST}/services.json`);
    const data = await res.json();
    return mapServices(data.main_services || []);
  }
  return [];
}
