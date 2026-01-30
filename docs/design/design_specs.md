# Design Specs & UI Flux - CRM La Cigale V0

**Date:** 30 Janvier 2026
**Inspiration :** Modern POS Style (Clean, Rounded, Sidebar Nav) + Touche "La Cigale" (Art Nouveau subtil).

---

## 1. Identité Visuelle (Look & Feel)

L'interface s'inspire de la fluidité des applications POS modernes (type Chili POS) tout en respectant l'élégance de La Cigale.

- **Philosophie :** "Une information = Une carte". Espaces blancs généreux pour la lisibilité tactile.
- **Palette de Couleurs (Suggérée) :**
  - **Fond global :** Gris très clair (#F5F7FA) pour détacher les cartes.
  - **Cartes/Conteneurs :** Blanc pur (#FFFFFF) avec ombres douces.
  - **Primaire (Actions) :** Or Vieilli / Ocre (#C5A065) ou Vert Bouteille profond (#1E4D2B) pour rappeler le lieu. _Éviter le vert néon._
  - **Texte :** Gris anthracite (#1F2937) pour le contraste max.
- **Formes :**
  - Coins arrondis (Rounded-lg, ~12px) sur les cartes et boutons.
  - Inputs larges et aérés (Hauteur min 48px).

---

## 2. Layout Global (Shell)

Structure fixe présente sur tous les écrans (Layout Shell).

```text
+---------------------------------------------------------------+
| SIDEBAR (Navigation) |  TOP BAR (Titre, Recherche, Date)      |
|                      |----------------------------------------|
| - Logo "Cigale"      |                                        |
| - [Icon] Liste       |  MAIN CONTENT AREA (Router View)       |
| - [Icon] Kanban      |                                        |
| - [Icon] Planning    |  [ VUE ACTIVE ICI ]                    |
|                      |                                        |
| [New Resa Btn (+)]   |                                        |
| (Flottant ou fixe)   |                                        |
+---------------------------------------------------------------+
```

- **Sidebar :** Fixe à gauche. Icônes claires + Labels. État actif marqué (Fond coloré léger + Bordure gauche).
- **Top Bar :** Contextuel. Affiche le titre de la vue ("Planning du 14 Fév") et la barre de recherche globale (Nom/Tel).

---

## 3. Détail des Vues (Specs)

### 3.1. Vue Liste (Tableur)

_Pour la gestion administrative._

- **Structure :** Tableau pleine largeur.
- **Colonnes :**
  1.  **Statut :** Pastille couleur (ex: Bleu=Futur, Vert=Arrivé).
  2.  **Date/Heure :** Format "JJ/MM - HH:mm".
  3.  **Client :** Gras pour le Nom, prénom normal.
  4.  **Couverts :** Badge numérique.
  5.  **Actions :** Bouton "..." (Menu: Modifier, Annuler).
- **Comportement :**
  - Header de colonne fixe (Sticky).
  - Ligne clickable -> Ouvre le détail/édition.

### 3.2. Vue Kanban (Service)

_Pour le suivi "Temps Réel"._

- **Colonnes du Kanban :**
  - _Note : Si pas de champ statut, grouper par tranches horaires (Midi 12h-13h | 13h-14h ...)_
- **Design des Cartes (Card UI) :**
  - Inspiré des cartes produits du POS exemple.
  - **Contenu Carte :**
    - **Haut :** Heure en gros (ex: "12:30").
    - **Milieu :** Nom Client (Troquer si trop long).
    - **Bas :** Badge "4 pers" + Icône Tel (si besoin appel rapide).
  - **Interaction :** Drag & Drop fluide.

### 3.3. Vue Planning (Calendrier)

_Pour la détection de conflits._

- **Structure :** Grille type "Outlook" ou "Google Calendar" (Vue Jour).
- **Axe Y :** Heures (11h -> 23h).
- **Axe X :** Unique (Vue Liste Temporelle) ou Multi-colonnes si on gérait des zones (Hors scope V0).
- **Tuiles de Réservation :**
  - Hauteur proportionnelle à la durée (défaut 1h30 ou 2h ?).
  - Couleur selon statut ou remplissage.
  - **Conflit :** Les tuiles se chevauchent ou se mettent côte à côte.

### 3.4. Modal de Création / Édition

_Formulaire critique pour la vitesse._

- **Type :** Panneau latéral (Drawer) venant de droite ou Modal centrée.
- **Formulaire :**
  - **Steppers ou Groupe :**
    1.  **Qui ?** (Nom, Prénom, Tel). _Validation Tel instantanée._
    2.  **Quand ?** (Datepicker + Chips pour les créneaux horaires 12:00, 12:15...).
    3.  **Combien ?** (Selecteur - / + ou Boutons "2", "4", "6").
- **Actions :** Bouton "Enregistrer" (Plein largeur, Sticky en bas sur mobile).

---

## 4. Composants & Feedback (États)

### États de Chargement (Skeleton)

- Ne jamais bloquer l'UI.
- Utiliser des rectangles gris pulsants (`animate-pulse` Tailwind) à la place des textes/tableaux.

### États Vides (Empty States)

- **Visuel :** Une illustration SVG simple (ex: une assiette vide ou une table stylisée).
- **Texte :** "Le service est calme."
- **Action :** Bouton primaire "Ajouter une réservation".

### Feedback Confirmations

- **Toast Notification :**
  - Petit rectangle flottant en haut à droite.
  - Vert émeraude pour succès.
  - Rouge brique pour erreur.
  - Disparition auto après 3s.

## 5. Wording Spécifique

- `firstname` -> "Prénom"
- `lastname` -> "Nom"
- `phone` -> "Téléphone" (Placeholder : "06 12 34 56 78")
- `guests` -> "Couverts"
