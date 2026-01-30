import Airtable from "airtable"

const apiKey = import.meta.env.VITE_AIRTABLE_API_KEY
const baseId = import.meta.env.VITE_AIRTABLE_BASE_ID
// DEBUG: Vérification dans la console du navigateur
console.log("--- AIRTABLE CONFIG DEBUG ---")
console.log("API Key configured:", !!apiKey)
console.log("API Key starts with:", apiKey ? apiKey.substring(0, 7) + "..." : "NONE")
console.log("Base ID:", baseId)
console.log("-----------------------------")
if (!apiKey) {
  console.error("CRITICAL: VITE_AIRTABLE_API_KEY is missing in .env")
  throw new Error(
    "La clé API Airtable est manquante. Veuillez configurer le fichier .env et redémarrer.",
  )
}

if (!baseId) {
  console.error("CRITICAL: VITE_AIRTABLE_BASE_ID is missing in .env")
  throw new Error("L'ID de la Base Airtable est manquant. Veuillez configurer le fichier .env.")
}

const airtable = new Airtable({apiKey})
export const base = airtable.base(baseId)
export const TABLE_NAME = import.meta.env.VITE_AIRTABLE_TABLE_NAME || "Reservations"
