/**
 * Formate un numéro de téléphone en retirant +33 et en ajoutant des espaces
 * +330770070707 -> 07 70 07 07 07
 */
export const formatPhoneNumber = (phone: string): string => {
  if (!phone) return ""

  // Retire le +33 et le remplace par 0
  let cleaned = phone.replace(/^\+33/, "0").replace(/\s/g, "")

  // Ajoute des espaces tous les 2 chiffres
  return cleaned.match(/.{1,2}/g)?.join(" ") || cleaned
}

/**
 * Groupe les réservations par date
 */
export const groupReservationsByDate = <T extends {date: string}>(
  reservations: T[],
): Map<string, T[]> => {
  const grouped = new Map<string, T[]>()

  reservations.forEach((resa) => {
    const existing = grouped.get(resa.date) || []
    grouped.set(resa.date, [...existing, resa])
  })

  return grouped
}
