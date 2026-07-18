import { CDN_HOST } from '@/lib/utils';
import { Instrument } from '@/types/instrument';
import { Service } from '@/types/service';
import { mapServices } from '@/lib/serviceMapper';

export type DatasetType = 'instruments' | 'services';

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
