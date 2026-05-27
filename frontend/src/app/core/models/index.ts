export interface EcolePublic {
  id: string;
  nom: string;
  slug: string;
  couleurPrimaire: string;
  couleurSecondaire: string;
  logoUrl: string | null;
  configuration: Configuration | null;
}

export interface Configuration {
  id: string;
  ecoleId: string;
  montantSixieme: number;
  montantCinquieme: number;
  montantQuatrieme: number;
  montantTroisieme: number;
}

export interface Inscription {
  id: string;
  ecoleId: string;
  nom: string;
  prenom: string;
  niveau: string;
  classe: string;
  telephone: string;
  operateur: 'WAVE' | 'ORANGEMONEY';
  reference: string;
  montantAttendu: number;
  montantRecu: number;
  preuveImage: string | null;
  statut: 'EN_ATTENTE' | 'VALIDE' | 'REJETE';
  adminNotes: string | null;
  dateInscrit: string;
  dateValide: string | null;
}

export interface DashboardStats {
  enAttente: number;
  valide: number;
  rejete: number;
  total: number;
  montantCollecte: number;
}

export interface AuthUser {
  id: string;
  email: string;
  role: 'GERANT' | 'SUPERADMIN';
  ecoleId: string | null;
  ecole: { id: string; nom: string; slug: string } | null;
}

export interface LoginResponse {
  accessToken: string;
  user: AuthUser;
}

export interface Ecole {
  id: string;
  nom: string;
  slug: string;
  couleurPrimaire: string;
  couleurSecondaire: string;
  logoUrl: string | null;
  statut: 'ACTIVE' | 'SUSPENDUE';
  dateCreation: string;
  configuration?: Configuration;
  _count?: { inscriptions: number; utilisateurs: number };
}

export interface GlobalStats {
  totalEcoles: number;
  ecolesActives: number;
  ecolesSuspendues: number;
  totalInscriptions: number;
  totalGerants: number;
  montantGlobalCollecte: number;
  inscriptionsParStatut: Record<string, number>;
}

export const NIVEAUX = ['6ème', '5ème', '4ème', '3ème'] as const;

export function getMontantForNiveau(
  niveau: string,
  config: Configuration,
): number {
  const map: Record<string, number> = {
    '6ème': config.montantSixieme,
    '5ème': config.montantCinquieme,
    '4ème': config.montantQuatrieme,
    '3ème': config.montantTroisieme,
  };
  return map[niveau] ?? config.montantSixieme;
}

export function formatMontant(montant: number): string {
  return new Intl.NumberFormat('fr-SN', {
    style: 'currency',
    currency: 'XOF',
    maximumFractionDigits: 0,
  }).format(montant);
}

export function statutLabel(statut: string): string {
  const labels: Record<string, string> = {
    EN_ATTENTE: 'En attente',
    VALIDE: 'Validé',
    REJETE: 'Rejeté',
  };
  return labels[statut] ?? statut;
}

export function statutClass(statut: string): string {
  const classes: Record<string, string> = {
    EN_ATTENTE: 'bg-amber-100 text-amber-800',
    VALIDE: 'bg-emerald-100 text-emerald-800',
    REJETE: 'bg-red-100 text-red-800',
  };
  return classes[statut] ?? 'bg-slate-100 text-slate-800';
}
