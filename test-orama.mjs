import { create, insert, search } from '@orama/orama';

async function run() {
  const db = await create({
    schema: {
      search_instruments1: 'string',
    },
  });

  const instruments1 = "FT Nuclear Magnetic Resonance spectrometer (FTNMR)";
  const search_instruments1 = instruments1.replace(/[-_/]/g, ' ').toLowerCase();

  await insert(db, {
    search_instruments1
  });

  const results = await search(db, {
    term: "ftnmr",
    exact: true,
    properties: ['search_instruments1']
  });

  console.log(JSON.stringify(results, null, 2));
}

run();
