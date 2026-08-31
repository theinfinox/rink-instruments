import { CDN_HOST } from '@/lib/utils';
import { Instrument } from '@/types/instrument';
import SectorCard from '@/components/ui/SectorCard';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Browse by Category — RINK Instruments and Services Portal',
  description: 'Explore instruments by category. Find equipment across various domains.',
};

export default async function CategoriesPage() {
  let categories: { slug: string, name: string, tech_count: number, icon: string, color: string }[] = [];
  let totalInstruments = 0;

  try {
    const res = await fetch(`${CDN_HOST}/instrument.json`, { next: { revalidate: 60 } });
    if (res.ok) {
      const data = await res.json();
      const instruments: Instrument[] = data.main_data || [];
      totalInstruments = instruments.length;
      
      const categoryMap = new Map<string, { slug: string, name: string, tech_count: number, icon: string, color: string }>();
      instruments.forEach((inst) => {
        const rawTags = Array.isArray(inst.tag) ? inst.tag : (inst.tag ? inst.tag.split(',') : []);
        rawTags.forEach((t: string) => {
          const name = t.trim();
          if (!name || name.length > 80) return;
          const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
          if (!slug || slug.length > 80) return;
          if (!categoryMap.has(slug)) {
            categoryMap.set(slug, { slug, name, tech_count: 0, icon: 'cpu', color: 'blue' });
          }
          categoryMap.get(slug)!.tech_count++;
        });
      });
      categories = Array.from(categoryMap.values()).sort((a, b) => b.tech_count - a.tech_count);
    }
  } catch (error) {
    console.error('Failed to fetch categories:', error);
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <Link href="/" className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-accent-secondary transition-colors mb-3">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <h1 className="text-2xl font-heading font-bold text-heading">Browse by Category</h1>
          <p className="text-text-secondary text-sm mt-1">
            {categories.length} categories · {totalInstruments}+ instruments
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {categories.map((sector) => (
            <SectorCard key={sector.slug} sector={sector} />
          ))}
        </div>
      </div>
    </div>
  );
}
