# Product Requirements Document (PRD) - CRM La Cigale V0

**Date:** 30 Janvier 2026
**Version:** 1.0.0
**Statut:** Validé pour Développement
**Période:** V0 (MVP Strict)

---

## 1. Objectifs Business

L'objectif est de déployer une application interne rapide et fiable pour gérer les réservations du restaurant "La Cigale".
Le système actuel (cahier ou disparates) ne permet pas de gérer efficacement les pics de service (Midi/Soir) avec la rapidité requise.

**KPIs de succès V0 :**

- Suppression des erreurs de saisie (format téléphone, dates invalides).
- Visualisation immédiate de la charge du service via la vue Planning.
- Centralisation des données fiable (Airtable comme source unique).

---

## 2. Dictionnaire de Données & Règles Métier

L'intégrité des données est critique. Tout input ne respectant pas ces règles doit être rejeté avant envoi à Airtable.

| Champ       | Type Technique | Requis  | Règles de Validation / Métier                                                                                                |
| :---------- | :------------- | :-----: | :--------------------------------------------------------------------------------------------------------------------------- |
| `firstname` | String         | **OUI** | Trim automatique. Au moins 2 caractères.                                                                                     |
| `lastname`  | String         | **OUI** | Trim automatique. Au moins 2 caractères.                                                                                     |
| `phone`     | **String**     | **OUI** | **Critique :** Stocké en String. Min 6 caractères. Accepte `+`, ` `, `.`, `-`. Ne jamais convertir en INT. Ex: ` "06 12..."` |
| `email`     | String         |   Non   | Validation format email standard (regex simple). Lowercase.                                                                  |
| `date`      | DateString     | **OUI** | Format strict ISO 8601 : `YYYY-MM-DD`. Doit être >= Date du jour à la création.                                              |
| `time`      | String         | **OUI** | Format 24h : `HH:MM`. Pas de secondes. Créneaux valides par pas de 15min (ex: 12:00, 12:15).                                 |
| `guests`    | Integer        | **OUI** | Entier positif strict (>= 1). Limité à la capacité maximale (ex: 20 pour une résa standard).                                 |

---

## 3. Scope Fonctionnel (V0 Strict)

### 3.1. Gestion des Réservations (CRUD)

Le système doit permettre de Créer, Lire, Mettre à jour et Supprimer des réservations.

**US-01 : Création Rapide**

- **En tant que** Maître d'Hôtel,
- **Je veux** saisir une nouvelle réservation en moins de 30 secondes,
- **Afin de** ne pas faire attendre le client au téléphone.
- **Acceptance Criteria :**
  - Formulaire simple avec validation temps réel.
  - Le champ `phone` accepte les formats souples mais sauvegarde propre.
  - Feedback visuel immédiat en cas de succès (Toast).

**US-02 : Modification & Annulation**

- **En tant que** Maître d'Hôtel,
- **Je veux** modifier l'heure ou le nombre de couverts, ou annuler une réservation,
- **Afin de** gérer les imprévus.
- **Acceptance Criteria :**
  - La modification met à jour Airtable immédiatement.
  - Une confirmation est demandée pour la suppression.

### 3.2. Les Vues Obligatoires

**US-03 : Vue Liste (Tableur)**

- **En tant que** Manager,
- **Je veux** voir toutes les réservations sous forme de grille compacte,
- **Afin de** faire des recherches globales ou de l'export mental rapide.
- **Acceptance Criteria :**
  - Colonnes triables (Date, Nom).
  - Affichage dense mais lisible.

**US-04 : Vue Kanban (Suivi Service)**

- **En tant que** Chef de Rang,
- **Je veux** visualiser les réservations par statut (ex: "À venir", "Arrivé", "Terminé" - _Note: Statuts simulés pour la V0 si champ statut absent, ou basés sur Time_),
- **Afin de** suivre le flux du service.
- **Acceptance Criteria :**
  - Cartes simples avec : Nom, Heure, Couverts.
  - Drag & Drop (si API le permet, sinon changement statut au clic).
  - _Note V0 : Si le champ 'Status' n'existe pas dans Airtable, la vue Kanban groupera par 'Heure' ou sera désactivée/simulée._

**US-05 : Vue Planning (Calendrier)**

- **En tant que** Responsable Planning,
- **Je veux** voir les réservations positionnées sur une grille horaire (Semaine ou Jour),
- **Afin de** détecter les créneaux surchargés (Overbooking).
- **Acceptance Criteria :**
  - Vue Jour par défaut.
  - Blocs visuels proportionnels ou fixes.
  - Détection visuelle immédiate des conflits horaires.

---

## 4. États de l'Interface (UX Requirements)

Pour garantir une expérience fluide en plein "rush", l'application doit gérer explicitement 4 états :

1.  **Loading :** Squelette (Skeleton screens) pendant le chargement des données. Pas de spinner bloquant tout l'écran.
2.  **Empty :** Message clair et encourageant si aucune réservation ("Aucune réservation pour ce service"). Bouton "Créer" bien visible.
3.  **Error :**
    - Erreur API : "Impossible de joindre le serveur. Vérifiez votre connexion." (Toast Rouge).
    - Erreur Formulaire : Message sous le champ concerné (ex: "Numéro invalide").
    - **Jamais** d'erreur technique brute (Stack trace) affichée à l'utilisateur.
4.  **Success :** Confirmation discrète mais visible (Toast Vert "Réservation enregistrée") qui disparaît seule.

---

## 5. Definition of Done (DoD) - V0 Release

Cette définition s'applique à l'ensemble du projet pour valider la livraison de la V0.

- ✅ **Fonctionnel complet :** Toutes les User Stories "MUST HAVE" sont implémentées et validées.
- ✅ **Sécurité :** Aucun token Airtable n'est versionné (fichier `.env.example` présent, variables chargées via process.env).
- ✅ **Zéro Bug Bloquant :** Les flux critiques (Création, Lecture) fonctionnent sans crash.
- ✅ **Code Propre :** Pas de `console.log` de debug, types TypeScript sans `any` (sauf exception justifiée).
- ✅ **Déployable :** L'application se lance via `npm start` ou commande équivalente documentée.
