export const NIVEAUX = ['6ème', '5ème', '4ème', '3ème'] as const;
export const CLASSES_SUFFIXES = ['A', 'B', 'C', 'D'] as const;

export type Niveau = (typeof NIVEAUX)[number];

export function getMontantForNiveau(
  niveau: string,
  config: {
    montantSixieme: number;
    montantCinquieme: number;
    montantQuatrieme: number;
    montantTroisieme: number;
  },
): number {
  const map: Record<string, number> = {
    '6ème': config.montantSixieme,
    '5ème': config.montantCinquieme,
    '4ème': config.montantQuatrieme,
    '3ème': config.montantTroisieme,
  };
  return map[niveau] ?? config.montantSixieme;
}

export function generateReference(operateur: string): string {
  const prefix = operateur === 'WAVE' ? 'WAVE' : 'OM';
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `${prefix}-${date}-${random}`;
}

export function getClassesForNiveau(niveau: string): string[] {
  return CLASSES_SUFFIXES.map((s) => `${niveau} ${s}`);
}
