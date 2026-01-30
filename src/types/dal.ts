export interface Reservation {
  id: string
  firstname: string
  lastname: string
  phone: string
  email?: string
  /** ISO 8601 YYYY-MM-DD */
  date: string
  /** HH:MM 24h format */
  time: string
  guests: number
  created_at?: string
}

export type DalResult<T> = {success: true; data: T} | {success: false; error: string; code?: string}

export interface ReservationRepository {
  getReservations(): Promise<DalResult<Reservation[]>>
  createReservation(
    reservation: Omit<Reservation, "id" | "created_at">,
  ): Promise<DalResult<Reservation>>
  updateReservation(
    id: string,
    updates: Partial<Omit<Reservation, "id" | "created_at">>,
  ): Promise<DalResult<Reservation>>
  deleteReservation(id: string): Promise<DalResult<void>>
}

export const VALIDATION_RULES = {
  PHONE_MIN_LENGTH: 6,
  GUESTS_MIN: 1,
  GUESTS_MAX: 100,
  TIME_STEP_MIN: 15,
}
