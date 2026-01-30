// Contrat DAL - CRM La Cigale V0
// Ce fichier définit les interfaces TypeScript que l'agent développeur DOIT implémenter.
// Localisation cible : /src/types/dal.ts

/**
 * Représente une Réservation validée métier.
 */
export interface Reservation {
  id: string; // ID unique Airtable
  firstname: string; // Prénom
  lastname: string; // Nom
  phone: string; // STRING OBLIGATOIRE (ex: "+33 6...")
  email?: string; // Email optionnel
  date: string; // ISO 8601 (YYYY-MM-DD)
  time: string; // HH:MM (24h)
  guests: number; // Nombre de couverts (entier > 0)
  created_at?: string; // Date de création (metadonnée)
}

/**
 * Structure standardisée de réponse du DAL.
 * Évite les try/catch dans l'UI.
 */
export type DalResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; code?: string };

/**
 * Interface du Repository (Service d'accès aux données).
 * C'est le contrat que le service Airtable doit remplir.
 */
export interface ReservationRepository {
  /**
   * Récupère toutes les réservations futures (ou d'une période donnée).
   */
  getReservations(): Promise<DalResult<Reservation[]>>;

  /**
   * Crée une nouvelle réservation avec validation préalable.
   */
  createReservation(
    reservation: Omit<Reservation, "id" | "created_at">,
  ): Promise<DalResult<Reservation>>;

  /**
   * Met à jour une réservation existante.
   */
  updateReservation(
    id: string,
    updates: Partial<Omit<Reservation, "id" | "created_at">>,
  ): Promise<DalResult<Reservation>>;

  /**
   * Supprime une réservation.
   */
  deleteReservation(id: string): Promise<DalResult<void>>;
}

/**
 * Types utilitaires pour la validation (Zod schema helper)
 */
export const VALIDATION_RULES = {
  PHONE_MIN_LENGTH: 6,
  GUESTS_MIN: 1,
  GUESTS_MAX: 100, // Sécurité arbitraire
  TIME_STEP_MIN: 15,
};
