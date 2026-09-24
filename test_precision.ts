import { precisionSearch, buildSearchIndex } from './src/lib/searchEngine';
import { fetchInstrumentBundle } from './src/lib/dataFetcher';
import { InstitutionRepository } from './src/repositories/InstitutionRepository';

async function test() {
  const bundle = await fetchInstrumentBundle();
  const repo = InstitutionRepository.fromInstrumentData(bundle.main_data, bundle.instituitiion_list, bundle.subsidized_list);
  const index = buildSearchIndex(bundle.main_data, repo);
  const results = await precisionSearch('FTNMR', index);
  console.log('Results found:', results.length);
}
test();
