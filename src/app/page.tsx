import { fetchDataset } from '@/lib/dataFetcher';
import { Instrument } from '@/types/instrument';
import { Service } from '@/types/service';
import PortalManager from '@/components/ui/PortalManager';

export const metadata = {
  title: 'RINK Instrumentation Portal — Kerala Startup Mission',
  description:
    "Explore research instruments and testing facilities available at Kerala's leading research institutions under the Research Innovation Network Kerala (RINK).",
};

export default async function HomePage() {
  // Fetch both datasets concurrently
  const [instruments, services] = await Promise.all([
    fetchDataset('instruments') as Promise<Instrument[]>,
    fetchDataset('services') as Promise<Service[]>,
  ]);

  return (
    <PortalManager 
      instruments={instruments} 
      services={services} 
      initialView="instruments" 
    />
  );
}
