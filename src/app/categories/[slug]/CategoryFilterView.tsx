'use client';

import { useState } from 'react';
import { InstrumentViewModel } from '@/domain/instrument/view-model';
import TechnologyCard from '@/components/ui/TechnologyCard';
import { FlaskConical } from 'lucide-react';

interface Props {
  initialInstruments: InstrumentViewModel[];
}

const TABS = [
  { label: 'All Institutions', value: 'all' },
  { label: 'KAU', value: 'kau' },
  { label: 'CPCRI', value: 'cpcri' },
  { label: 'CTCRI', value: 'ctcri' },
  { label: 'NIIST', value: 'niist' },
  { label: 'CWRDM', value: 'cwrdm' },
  { label: 'KSCSTE', value: 'kscste' },
];

const matchesInstitution = (inst: InstrumentViewModel, filter: string) => {
  if (filter === 'all') return true;
  const name = inst.institution?.toLowerCase() || '';
  return name.includes(filter);
};

export default function CategoryFilterView({ initialInstruments }: Props) {
  const [activeTab, setActiveTab] = useState('all');

  const filteredTechs = initialInstruments.filter(tech => matchesInstitution(tech, activeTab));

  return (
    <div>
      {/* Tabs */}
      <div className="border-b border-border mb-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-3 scrollbar-none">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-accent text-white shadow-sm'
                    : 'bg-card text-text-secondary border border-border hover:border-accent/30 hover:text-text-primary'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid */}
      {filteredTechs.length === 0 ? (
        <div className="text-center py-20 bg-card rounded-md border border-border">
          <FlaskConical className="w-12 h-12 text-text-secondary/50 mx-auto mb-4 animate-pulse" />
          <h3 className="font-heading font-bold text-heading text-lg mb-1">No Instruments Found</h3>
          <p className="text-text-secondary text-sm">
            We couldn&apos;t find any instruments matching the active institution filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {filteredTechs.map(tech => (
            <TechnologyCard key={tech.id} instrument={tech} />
          ))}
        </div>
      )}
    </div>
  );
}
