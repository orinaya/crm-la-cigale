# Structure des Données de Réservation (Airtable)

Ce document résume la structure des données définie dans le cadrage du projet, qui servira de modèle pour les échanges de données (CSV / JSON) avec l'API Airtable.

## Dictionnaire de Données

| Champ       | Type       | Obligatoire | Format / Validation                                      | Description                                  |
| :---------- | :--------- | :---------- | :------------------------------------------------------- | :------------------------------------------- |
| `firstname` | String     | **OUI**     | > 1 caractère, Trim                                      | Prénom du client                             |
| `lastname`  | String     | **OUI**     | > 1 caractère, Trim                                      | Nom de famille du client                     |
| `phone`     | String     | **OUI**     | Min 6 caractères. **STRING** (ex: "+33 6..."). Pas d'INT | Numéro de téléphone pour confirmation/rappel |
| `email`     | String     | Non         | Format email standard                                    | Email de contact (optionnel)                 |
| `date`      | DateString | **OUI**     | ISO 8601 `YYYY-MM-DD`                                    | Date de la réservation (>= Aujourd'hui)      |
| `time`      | String     | **OUI**     | Format 24h `HH:MM` (Pas de 15 min)                       | Heure d'arrivée. Doit respecter les créneaux |
| `guests`    | Integer    | **OUI**     | Entier >= 1                                              | Nombre de couverts                           |

## Exemple de format CSV

Voici un exemple textuel représentant un export CSV type de cette table, utile pour les tests d'import ou la validation des jeux de données.

```csv
firstname,lastname,phone,email,date,time,guests
Jean,Dupont,"+33 6 12 34 56 78",jean.dupont@email.com,2026-02-14,19:30,2
Marie,Curie,"0698765432",,2026-02-14,20:00,4
Léon,Blum,"+33 7 00 00 00 00",leon.b@histoire.fr,2026-02-15,12:15,3
Sarah,Connor,"0123456789",sarah@skynet.net,2026-02-15,13:00,1
```

## Règles Métier Critiques

1.  **Format Téléphone :** Le champ `phone` doit toujours être traité comme une chaîne de caractères pour préserver les zéros initiaux et les symboles internationaux (+).
2.  **Date vs Time :** Airtable gère parfois les dates et heures ensemble. Ici, nous séparons explicitement :
    - `date` pour le jour.
    - `time` pour l'horaire.
3.  **Intégrité :** Une réservation sans `guests`, `date` ou `lastname` est invalide et doit être rejetée par l'API.
