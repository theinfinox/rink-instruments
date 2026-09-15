const KERALA_DISTRICTS = [
  'thiruvananthapuram',
  'kollam',
  'pathanamthitta',
  'alappuzha',
  'kottayam',
  'idukki',
  'ernakulam',
  'thrissur',
  'palakkad',
  'malappuram',
  'kozhikode',
  'wayanad',
  'kannur',
  'kasaragod'
];

export function normalizeDistrict(district: string | null | undefined): string {
  if (!district) return '';
  const raw = district.toLowerCase().trim().replace(/[^a-z]/g, '');
  
  // Handle common aliases/spellings
  if (raw.includes('trivandrum')) return 'thiruvananthapuram';
  if (raw.includes('cochin')) return 'ernakulam';
  if (raw.includes('calicut')) return 'kozhikode';
  if (raw.includes('quilon')) return 'kollam';
  if (raw.includes('cannanore')) return 'kannur';
  if (raw.includes('palghat')) return 'palakkad';
  if (raw.includes('alleppey')) return 'alappuzha';
  if (raw.includes('trichur')) return 'thrissur';

  // Exact matching against the 14 standard districts
  for (const standard of KERALA_DISTRICTS) {
    if (raw.includes(standard)) return standard;
  }
  
  return raw;
}
