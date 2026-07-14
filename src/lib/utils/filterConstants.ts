

export function classifyInstitution(name: string | undefined | null): string {
  if (!name) return "Other";
  const lowerName = name.toLowerCase();

  if (/(iit|nit|iiser|national institute)/i.test(lowerName)) {
    return "National Institutes";
  }
  if (/(university|cusat|ktu)/i.test(lowerName)) {
    return "Universities";
  }
  if (/(csir|icar|stic|centre)/i.test(lowerName)) {
    return "Government R&D Labs";
  }
  if (/(pvt|ltd|inc)/i.test(lowerName)) {
    return "Private / Corporate Labs";
  }
  
  return "Other";
}
