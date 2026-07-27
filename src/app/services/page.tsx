import { fetchDataset, fetchInstrumentBundle } from '@/lib/dataFetcher';
import { Service } from '@/types/service';
import PortalManager from '@/components/ui/PortalManager';
import { InstitutionRepository } from '@/repositories/InstitutionRepository';
import { toInstrumentViewModel } from '@/domain/instrument/mapper';

export const metadata = {
  title: 'RINK Services Portal — Kerala Startup Mission',
  description:
    "Explore services available at Kerala's leading startups under the Research Innovation Network Kerala (RINK).",
};

export default async function ServicesHomePage() {
  // Fetch both datasets concurrently
  const [instrumentBundle, services] = await Promise.all([
    fetchInstrumentBundle(),
    fetchDataset('services') as Promise<Service[]>,
  ]);

  const repo = InstitutionRepository.fromInstrumentData(
    instrumentBundle.main_data,
    instrumentBundle.instituitiion_list,
    instrumentBundle.mou_list
  );

  const instrumentViewModels = instrumentBundle.main_data.map(inst => toInstrumentViewModel(inst, repo));

  return (
    <PortalManager 
      instruments={instrumentViewModels} 
      institutionList={instrumentBundle.instituitiion_list}
      mouList={instrumentBundle.mou_list}
      services={services} 
      initialView="services" 
    />
  );
}
