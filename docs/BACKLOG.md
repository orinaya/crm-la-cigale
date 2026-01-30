# BACKLOG PROJET - CRM La Cigale V0

Ce backlog priorise les tâches pour l'équipe de développement.
**Méthode de priorisation :** MoSCoW (Must, Should, Could, Won't).
**Sprint :** V0 Unique.

---

## 🔴 MUST HAVE (Impératifs pour la mise en ligne)

### A. Setup & Architecture

- [ ] **Initialisation Projet :** Setup repo, linter, framework.
- [ ] **Configuration Secrets :** `.env` pour API Key Airtable & Base ID.
- [ ] **Implémentation DAL (Data Access Layer) :**
  - Création des types TypeScript `Reservation` stricts.
  - Service `fetchReservations` (GET).
  - Service `createReservation` (POST) avec validation Zod.
  - Service `updateReservation` (PATCH).
  - Service `deleteReservation` (DELETE).

### B. Interface Utilisateur (UI)

- [ ] **Composants Base :** Bouton, InputText, Modal/Dialog, Card.
- [ ] **Gestion États Globaux :** Composant `SkeletonLoader`, Composant `ErrorBanner`, Système de `Toast` (Notifications).
- [ ] **Navigation :** Menu simple pour basculer entre les 3 vues.

### C. Vues Métier

- [ ] **Vue Liste (Table) :**
  - Affichage des données brutes.
  - Tri par Date/Heure par défaut.
- [ ] **Vue Planning (Calendrier) :**
  - Affichage vue Jour.
  - Positionnement des cartes selon l'`heure`.
- [ ] **Vue Kanban :**
  - Groupement basique (par statut si dispo, sinon "Midi / Soir" selon heure).

### D. Formulaires

- [ ] **Formulaire Création/Édition :**
  - Validation stricte `phone` (String).
  - Sélecteur de date (Datepicker) limitant au futur.
  - Sélecteur d'heure (Timepicker) par pas de 15min.

---

## 🟡 SHOULD HAVE (Important mais contournable pour V0 si retard)

- [ ] **Filtres Avancés :** Recherche textuelle par nom dans la Vue Liste.
- [ ] **Vue Semaine :** Dans le calendrier (la vue Jour est la priorité V0).
- [ ] **Validation Email :** Envoi d'un email de confirmation (hors scope V0, mais validation de format dans le formulaire est un Should).

---

## 🟢 COULD HAVE (Nice to have - V1)

- [ ] **Mode Sombre :** Pour le service du soir (ambiance tamisée).
- [ ] **Export CSV :** Bouton pour télécharger la liste.
- [ ] **Historique Client :** Voir les visites précédentes lors de la saisie.

---

## ⚫ WON'T HAVE (Hors Scope V0 - Explicite)

- [ ] **Authentification Utilisateur (Login/Mot de passe) :** On suppose un accès sécurisé par le réseau interne ou Basic Auth serveur pour la V0. Pas de gestion complexe de rôles.
- [ ] **Plan de table graphique :** Pas de dessin de la salle.
- [ ] **Paiement en ligne / Empreinte bancaire.**
- [ ] **Gestion des stocks / Menu.**
