import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import CategoryFilterView from './CategoryFilterView';
import { getSectorIcon } from '@/components/ui/SectorIcons';
import SectorBackground from '@/components/ui/SectorBackgrounds';
import { CDN_HOST } from '@/lib/utils';
import { Instrument } from '@/types/instrument';

// Helper to get category map from CDN
async function getCategoryData() {
  const res = await fetch(`${CDN_HOST}/instrument.json`, { next: { revalidate: 60 } });
  if (!res.ok) return { categories: new Map(), instruments: [] };
  const data = await res.json();
  const instruments: Instrument[] = data.main_data || [];
  
  const categoryMap = new Map<string, { slug: string, name: string, tech_count: number, color: string }>();
  instruments.forEach((inst) => {
    const rawTags = Array.isArray(inst.tag) ? inst.tag : (inst.tag ? inst.tag.split(',') : []);
    rawTags.forEach((t: string) => {
      const name = t.trim();
      if (!name) return;
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      if (!categoryMap.has(slug)) {
        categoryMap.set(slug, { slug, name, tech_count: 0, color: '#1B4D9B' }); // default color
      }
      categoryMap.get(slug)!.tech_count++;
    });
  });
  return { categories: categoryMap, instruments };
}

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const { categories } = await getCategoryData();
  return Array.from(categories.values()).map(c => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const { categories } = await getCategoryData();
  const sector = categories.get(slug);
  if (!sector) return { title: 'Category Not Found — RINK' };
  
  const metaDescription = `Browse ${sector.tech_count} instruments in ${sector.name}. Discover research breakthroughs from Kerala institutions ready for industry deployment.`;
  
  return {
    title: `${sector.name} Instruments | RINK Kerala`,
    description: metaDescription,
    openGraph: {
      title: `${sector.name} Instruments | RINK Kerala`,
      description: metaDescription,
      type: 'website',
    },
  };
}

export default async function CategoryDetailPage({ params }: Props) {
  const { slug } = await params;
  const { categories, instruments } = await getCategoryData();
  const sector = categories.get(slug);
  
  if (!sector) notFound();

  const categoryInstruments = instruments.filter(inst => {
    const rawTags = Array.isArray(inst.tag) ? inst.tag : (inst.tag ? inst.tag.split(',') : []);
    return rawTags.some((t: string) => t.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-') === slug);
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="relative bg-card border-b border-border overflow-hidden">
        {/* Dynamic Vector Background */}
        <SectorBackground slug={sector.slug} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <Link href="/categories" className="flex items-center gap-1.5 text-xs text-text-secondary hover:text-accent transition-colors mb-2">
            <ArrowLeft className="w-3.5 h-3.5" />
            All Categories
          </Link>
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-md flex items-center justify-center flex-shrink-0"
              style={{ background: `${sector.color}15` }}
            >
              {getSectorIcon(sector.slug, 'var(--accent)', 24)}
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-heading font-bold text-heading">{sector.name}</h1>
              <p className="text-xs text-text-secondary mt-0.5">
                {sector.tech_count} {sector.tech_count === 1 ? 'instrument' : 'instruments'} available
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <CategoryFilterView initialInstruments={categoryInstruments} />
      </div>
    </div>
  );
}
