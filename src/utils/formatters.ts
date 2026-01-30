/**
 * Formate un numéro de téléphone en retirant +33/0033 et en ajoutant des espaces
 * +330770070707 -> 07 70 07 07 07
 * 00330770070707 -> 07 70 07 07 07
 */
export const formatPhoneNumber = (phone: string): string => {
  if (!phone) return ""

  // Retire les espaces existants
  let cleaned = phone.replace(/\s/g, "")

  // Retire +33 ou 0033 et remplace par 0
  cleaned = cleaned.replace(/^\+33/, "0").replace(/^0033/, "0")

  // Si ça ne commence pas par 0, on l'ajoute
  if (!cleaned.startsWith("0")) {
    cleaned = "0" + cleaned
  }

  // Garde seulement 10 chiffres max
  cleaned = cleaned.slice(0, 10)

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
