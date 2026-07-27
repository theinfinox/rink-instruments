import { fetchDataset, fetchInstrumentBundle } from '@/lib/dataFetcher';
import { Service } from '@/types/service';
import PortalManager from '@/components/ui/PortalManager';

export const metadata = {
  title: 'RINK Instrumentation Portal — Kerala Startup Mission',
  description:
    "Explore research instruments and testing facilities available at Kerala's leading research institutions under the Research Innovation Network Kerala (RINK).",
};

export default async function HomePage() {
  // Fetch both datasets concurrently
  const [instrumentBundle, services] = await Promise.all([
    fetchInstrumentBundle(),
    fetchDataset('services') as Promise<Service[]>,
  ]);

  return (
    <PortalManager 
      instruments={instrumentBundle.main_data} 
      institutionList={instrumentBundle.instituitiion_list}
      mouList={instrumentBundle.mou_list}
      services={services} 
      initialView="instruments" 
    />
  );
}
