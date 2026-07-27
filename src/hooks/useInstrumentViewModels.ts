import { useMemo } from 'react';
import { useStore } from '@/store/useStore';
import { toInstrumentViewModel } from '@/domain/instrument/mapper';
import { InstrumentViewModel } from '@/domain/instrument/view-model';
import { AppState } from '@/store/useStore';

export function useInstrumentViewModels(): Readonly<InstrumentViewModel>[] {
  const filteredData = useStore((state: AppState) => state.filteredData);

  return useMemo(() => {
    return filteredData.map(inst => toInstrumentViewModel(inst));
  }, [filteredData]);
}
