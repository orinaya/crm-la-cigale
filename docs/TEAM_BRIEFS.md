# TEAM BRIEFS (Instructions Inter-Agents)

Ce document contient les directives spécifiques du Product Owner (PO) à chaque membre de l'équipe technique pour assurer la cohérence de la V0.

---

## 🏛️ Pour l'Agent Architecte Technique

**Sujet : Sécurité & Stabilité des Données**

1.  **Format Téléphone (Priorité Top) :**
    - Le champ `phone` dans Airtable est une chaîne. Ton type TypeScript `Reservation` doit le refléter (`string`).
    - **Interdiction** de le parser en `number` à aucun moment. Les zéros initiaux ("06...") sont vitaux.

2.  **Gestion des Dates :**
    - Airtable renvoie parfois des dates UTC. Assure-toi que l'affichage client reste toujours sur la timezone locale du restaurant (Paris, GMT+1/+2).
    - Utilise une librairie robuste (ex: `date-fns`) pour éviter les calculs manuels foireux.

3.  **Contrat DAL :**
    - Le Frontend ne doit jamais appeler Airtable directement. Tout passe par tes fonctions DAL.
    - Prévois un mécanisme de "Mock" ou de données bouchon si Airtable est down, pour que l'UX puisse travailler sans la connexion live au début.

4.  **Sécurité des Secrets (CRITIQUE) :**
    - Ne jamais commiter de clés API. Utilise `.env` pour stocker `AIRTABLE_API_KEY` et `AIRTABLE_BASE_ID`.
    - Le code doit échouer proprement au démarrage si ces variables sont manquantes.

---

## 🎨 Pour l'Agent UX/UI Designer

**Sujet : Efficacité en Service (Coup de feu)**

1.  **Règle des "Fat Fingers" :**
    - L'interface sera utilisée sur tablette ou écran tactile potentiellement. Les zones de clic (boutons, cartes) doivent être larges et espacées.
    - Pas de petits liens hypertexte impossibles à cliquer.

2.  **Lisibilité > Esthétique :**
    - Contraste élevé impératif. La lumière en salle peut varier.
    - Police de caractères lisible (Sans-serif) pour les données chiffrées (Heure, Couverts). Le style "Art Nouveau" reste en déco (titres, bordures), pas sur la data.

3.  **Feedback Immédiat :**
    - Quand on clique sur "Réserver", il ne doit pas y avoir de doute.
    - L'état "Loading" doit être doux (Squelette) et non agressif (Flash blanc).
