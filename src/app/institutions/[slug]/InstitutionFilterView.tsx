'use client';

import { useState } from 'react';
import { InstrumentViewModel } from '@/domain/instrument/view-model';
import TechnologyCard from '@/components/ui/TechnologyCard';
import { FlaskConical } from 'lucide-react';

interface Props {
  initialInstruments: InstrumentViewModel[];
}

const TABS = [
  { label: 'All', value: 'all' },
  { label: 'Agriculture', value: 'agriculture' },
  { label: 'Food Technology', value: 'food technology' },
  { label: 'Biotechnology', value: 'biotechnology' },
  { label: 'Water', value: 'water' },
  { label: 'Climate', value: 'climate' },
  { label: 'Manufacturing', value: 'manufacturing' },
  { label: 'AI & Software', value: 'ai' },
];

const matchesSector = (inst: InstrumentViewModel, filter: string) => {
  if (filter === 'all') return true;
  const tagsStr = (inst.tags || []).join(' ').toLowerCase();
  
  if (filter === 'agriculture') return tagsStr.includes('agriculture') || tagsStr.includes('agri');
  if (filter === 'food technology') return tagsStr.includes('food');
  if (filter === 'biotechnology') return tagsStr.includes('biotech');
  if (filter === 'water') return tagsStr.includes('water');
  if (filter === 'climate') return tagsStr.includes('climate') || tagsStr.includes('energy') || tagsStr.includes('sustain');
  if (filter === 'manufacturing') return tagsStr.includes('manufacturing') || tagsStr.includes('industrial') || tagsStr.includes('manufact') || tagsStr.includes('industr');
  if (filter === 'ai') return tagsStr.includes('digital') || tagsStr.includes('ai') || tagsStr.includes('software');
  
  return false;
};

export default function InstitutionFilterView({ initialInstruments }: Props) {
  const [activeTab, setActiveTab] = useState('all');

  const filteredTechs = initialInstruments.filter(inst => matchesSector(inst, activeTab));

  return (
    <div className="space-y-8">
      {/* Horizontally scrollable sector filter tabs */}
      <div className="border-b border-border">
        <div className="flex overflow-x-auto pb-3 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none sm:flex-wrap gap-2">
          {TABS.map(tab => {
            const isActive = activeTab === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`flex-shrink-0 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-md border transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-accent text-[#04142B] border-accent shadow-md shadow-accent/15'
                    : 'bg-card border-border text-text-secondary hover:text-text-primary hover:border-text-secondary/20'
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
            We couldn&apos;t find any instruments matching the active category filter.
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
