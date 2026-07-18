import { fetchDataset } from '@/lib/dataFetcher';
import { Instrument } from '@/types/instrument';
import { Service } from '@/types/service';
import PortalManager from '@/components/ui/PortalManager';

export const metadata = {
  title: 'RINK Services Portal — Kerala Startup Mission',
  description:
    "Explore services available at Kerala's leading startups under the Research Innovation Network Kerala (RINK).",
};

export default async function ServicesHomePage() {
  // Fetch both datasets concurrently
  const [instruments, services] = await Promise.all([
    fetchDataset('instruments') as Promise<Instrument[]>,
    fetchDataset('services') as Promise<Service[]>,
  ]);

  return (
    <PortalManager 
      instruments={instruments} 
      services={services} 
      initialView="services" 
    />
  );
}
