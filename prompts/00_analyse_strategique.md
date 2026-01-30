# ANALYSE STRATÉGIQUE & WORKFLOW VIBE CODING

Pour la réussite du projet **CRM La Cigale V0**, la communication entre les agents doit suivre un flux en cascade rigoureux ("Waterfall Agile"). L'objectif est d'éliminer les ambiguïtés avant même que la première ligne de code ne soit écrite.

## Workflow d'exécution

1.  **Agent PO (Le Gardien du Scope) :** Il définit le _QUOI_. Il transforme les besoins bruts en spécifications atomiques et priorisées (MoSCoW). Son rôle critique est de verrouiller le Scope V0 pour éviter le "feature creep".
2.  **Agent Architecte (Le Gardien de la Structure) :** Il définit le _COMMENT (Structure)_. Sur la base du PRD du PO, il établit les contrats d'interface. C'est le point de pivot : sans son contrat DAL (Data Access Layer), le développeur n'a pas le droit de coder. Il sécurise l'accès Airtable.
3.  **Agent UX (Le Gardien de l'Expérience) :** Il définit le _COMMENT (Visuel)_. Il travaille en parallèle ou juste après l'architecte pour mapper les flux sur les données. Il doit garantir la lisibilité pour un service rapide (contrainte "Midi/Soir").
4.  **Agent Développeur (L'Exécuteur) :** Il réalise le _FAIRE_. Il reçoit des inputs "Clean" : un PRD validé, une interface TypeScript stricte et des specs UI. Il n'invente rien, il assemble.

## Points d'attention critiques

- **Format de Date/Heure :** Airtable est capricieux. L'Architecte doit imposer des utilitaires de conversion ISO 8601 stricts dans le contrat DAL pour éviter les bugs de timezone.
- **Type `phone` :** L'erreur fréquente est de traiter le téléphone comme un nombre. Tous les agents doivent être alignés sur le fait que c'est une `String`.
- **Séparation Code/Doc :** Si un agent non-dév commence à générer du code, la source de vérité se dilue. Le respect strict des restrictions est vital.
