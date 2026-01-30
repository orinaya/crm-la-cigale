# RAID LOG - CRM La Cigale V0
**(Risks, Assumptions, Issues, Dependencies)**

Ce document recense les contraintes et les facteurs de risque identifiés pour la phase V0.

---

## 🛑 R - Risks (Risques)

1.  **Airtable Rate Limits (Critique) :**
    *   **Description :** L'API Airtable limite à 5 requêtes/seconde. En plein service, si plusieurs serveurs rafraîchissent ou modifient en même temps, on peut taper le plafond.
    *   **Mitigation :** L'Architecte doit prévoir un "Debounce" sur les inputs et une gestion propre des erreurs 429 (Too Many Requests) avec retry automatique.

2.  **Perte de Connexion (Moyen) :**
    *   **Description :** Le restaurant a des murs épais (Art Nouveau). Le Wifi peut sauter.
    *   **Mitigation :** L'interface doit clairement indiquer "Hors Ligne" et empêcher la modification pour éviter la perte de données (Pas de mode Offline complexe en V0, juste une sécurité bloquante).

3.  **Erreur de Saisie Phone (Élevé) :**
    *   **Description :** Les serveurs saisissent vite. Le format téléphone est souvent la cause de rejets API.
    *   **Mitigation :** Le champ doit être permissif à la saisie (accepter espaces, points) mais le code doit nettoyer avant envoi.

---

## 🔮 A - Assumptions (Hypothèses)

1.  **Dictionnaire de données stable :** On suppose que la table Airtable existe déjà avec exactement les noms de colonnes définis dans le `dictionnaire_donnees.md`. Tout changement là-bas casse l'appli.
2.  **Usage Interne uniquement :** L'application n'est pas ouverte au public sur internet. Pas de protection anti-spam (Captcha) nécessaire sur le formulaire pour la V0.
3.  **Appareils Modernes :** Les serveurs utilisent des tablettes ou smartphones récents (Support CSS Grid/Flexbox ok).

---

## 🚩 I - Issues (Problèmes connuns)

*   *Aucun problème bloquant actif pour le moment (Phase de démarrage).*

---

## 🔗 D - Dependencies (Dépendances)

1.  **Disponibilité API Airtable :** Dépendance critique. Si Airtable est down, le restaurant reprend le papier.
2.  **Clé API / Token :** Le développeur a besoin d'un Access Token Airtable (Personal Access Token) configuré avec les droits `data.records:read` et `data.records:write`.
