# Politique de Sécurité et Gestion des Secrets

## 1. Variables d'Environnement (`.env`)

L'application ne doit contenir **AUCUN** secret en dur dans le code source.
Nous utilisons le standard `.env` chargé par Vite (préfixe `VITE_`).

### Fichier `.env.example` (à commiter)

```ini
# URL de base de l'API Airtable (Standard)
VITE_AIRTABLE_ENDPOINT_URL=https://api.airtable.com/v0

# ID de la Base Airtable (Commence par 'app...')
# Ce n'est pas un secret critique, mais configurationnel.
VITE_AIRTABLE_BASE_ID=

# Nom de la table dans Airtable (Doit correspondre exactement)
VITE_AIRTABLE_TABLE_NAME=Reservations

# Délai de timeout pour les requêtes (ms)
VITE_API_TIMEOUT=5000
```

### Fichier `.env.local` (NON versionné - .gitignore)

```ini
# CLÉ D'API PERSONNELLE (Commence par 'pat...')
# CRITIQUE : Ne jamais partager.
# Si leaked : Révoquer et régénérer immédiatement sur Airtable.
VITE_AIRTABLE_API_KEY=patXXXXXXXXXXXXXXXXXXXXXXXX
```

## 2. Validation des Données (Input Sanitization)

La sécurité commence par ne pas faire confiance à l'entrée utilisateur.
Nous utiliserons la librairie **Zod** pour valider les données AVANT l'envoi à Airtable.

**Schéma de validation strict :**

1.  **Injection HTML/Script :** Les champs textes (`firstname`, `lastname`) doivent être nettoyés (Trim) et échappés à l'affichage par React automatiquement.
2.  **Type Injection :** Le champ `guests` doit être forcé en `number` safe integer.
3.  **Format Phone :** Le champ `phone` est une `string` mais on refuse les scripts (<script>). On autorise uniquement `[0-9+ .-]`.

## 3. Gestion des Droits

Pour cette V0 (Usage Interne), l'authentification est déléguée au réseau/contexte physique.
Cependant, le Token Airtable utilisé doit être un **"Personal Access Token" (PAT)** avec le périmètre (Scope) minimal :

- `data.records:read`
- `data.records:write`
- `schema.bases:read` (Optionnel, pour introspection)

**Refuser** l'usage d'une "Global API Key" (Legacy) qui donne accès à tout le compte Airtable.
