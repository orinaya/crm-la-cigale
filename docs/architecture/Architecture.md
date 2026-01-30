# Architecture Technique - CRM La Cigale V0

**Date:** 30 Janvier 2026
**Version:** 1.0.0
**Statut:** Validé

---

## 1. Choix Technologiques (Stack)

Pour répondre aux contraintes de rapidité, de sobriété et de robustesse ("Vibe Coding"), nous partons sur une stack moderne et typée.

- **Runtime/Build:** Node.js (Dev), Vite (Build tool pour rapidité extrême).
- **Langage :** TypeScript (Strict mode obligatoire).
- **Frontend Framework :** React (Écosystème riche, composants fonctionnels).
- **Styling :** Tailwind CSS (Vitesse d'intégration, maintenance facile).
- **State Management :** React Context + Hooks par défaut (Suffisant pour V0).
- **Data Access Layer (DAL) :** Airtable.js (SDK officiel) encapsulé.
- **Validation :** Zod (Validation runtime des typages).
- **Dates :** date-fns (Léger et immuable).

---

## 2. Architecture Globale & Flux de Données

L'architecture suit le principe de la **Clean Architecture** simplifiée pour le frontend. La couche de présentation (UI) ne communique jamais directement avec l'API Airtable. Elle passe par une couche d'abstraction (DAL).

```mermaid
graph TD
    User[Utilisateur] -->|Interagit| UI[Couche Interface (React)]
    UI -->|Appelle| DAL[Data Access Layer (Service)]
    DAL -->|Valide (Zod)| Validation[Moteur de Validation]
    DAL -->|Requête| API[Airtable API]
    API -->|Réponse JSON| DAL
    DAL -->|Adapte & Type| UI
```

### 2.1. Structure de Dossiers Cible (`/src`)

```
src/
├── assets/          # Images, fonts
├── components/      # Composants UI réutilisables (Button, Input, Card)
│   ├── ui/          # Atomes (Design System)
│   └── domain/      # Molécules métier (ReservationCard, PlanningGrid)
├── dal/             # Data Access Layer (Le cœur de la logique)
│   ├── airtable.ts  # Configuration et Client Airtable
│   ├── repository.ts # Implémentation des fonctions CRUD
│   └── mock.ts      # Données de test (Fallback hors ligne)
├── types/           # Définitions TypeScript partagées (voir dal_contract.ts)
├── utils/           # Fonctions utilitaires (dateFormatter, phoneCleaner)
├── App.tsx          # Point d'entrée & Routing (Navigation simple)
└── main.tsx         # Montage React
```

---

## 3. Stratégie de Gestion des Erreurs

Pour éviter les "écrans blancs" (White Screen of Death) et les logs techniques incompréhensibles pour les serveurs.

1.  **Au niveau DAL (Logique) :**
    - Toute interaction API est enveloppée dans un `try/catch`.
    - Le DAL ne "throw" pas d'erreur brute. Il retourne un objet standardisé : `{ success: boolean, data?: T, error?: string }`.

2.  **Au niveau UI (Visuel) :**
    - Vérification systématique de `result.success`.
    - Si `false` -> Affichage d'un Toast ou d'une Bannière d'erreur conviviale.
    - Utilisation de "Error Boundaries" React pour capturer les crashs de rendu imprévus.

---

## 4. Décisions Techniques Clés

- **Zéro "Magic strings" :** Toutes les statuts, formats de date et noms de champs Airtable sont définis dans des constantes (e.g., `const AIRTABLE_FIELDS = { PHONE: 'phone', ... }`).
- **Dates ISO :** Airtable géré en UTC, le front convertit en Local Time à l'affichage SEULEMENT. Le stockage reste ISO 8601 (`YYYY-MM-DD`).
- **Phone as String :** Conformément au PRD, le téléphone est traité comme une chaîne. Aucune mathématique dessus.
