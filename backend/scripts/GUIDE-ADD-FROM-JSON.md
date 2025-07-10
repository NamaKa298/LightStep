# Guide d'utilisation du script add-from-json.ts

## Vue d'ensemble

Ce script permet d'ajouter des produits en masse depuis un fichier JSON vers votre base de données PostgreSQL (Neon). Il a été adapté pour correspondre exactement au schéma SQL optimisé.

## Workflow complet avec images

```
1. Images locales → 2. JSON produits → 3. Upload R2 + DB → 4. Nettoyage
   backend/temp-images/    products-to-add.json    Cloudflare R2 + Neon     Suppression locale
```

## Structure du fichier JSON

### Champs obligatoires

- `name` (string) : Nom du produit
- `price` (number) : Prix en euros

### Champs optionnels principaux

- `brand` (string) : Marque
- `type` (string) : Type de chaussure
- `category` (string) : Catégorie (trail, casual, running, etc.)
- `gender` (string) : 'M', 'F', 'U' (Unisex)
- `sizes` (number[]) : Tableau des tailles disponibles
- `description` (string) : Description du produit
- `image_url` (string) : Nom du fichier image (sera uploadé sur R2)
- `stock` (number) : Quantité en stock

### Champs d'évaluation

- `rating` (number) : Note moyenne (0.0 à 5.0)
- `review_count` (number) : Nombre total d'avis
- `1_star`, `2_star`, `3_star`, `4_star`, `5_star` (number) : Compteurs par note
- `is_recommended` (number) : 0 = non recommandé, 1 = recommandé

### Champs techniques

- `weight` (number) : Poids en grammes
- `ground_types` (string) : Types de terrain ("route,trail,montagne")
- `stability` (string) : Type de stabilité ("neutre", "pronateur", etc.)
- `drop_height` (number) : Drop en mm
- `sole_details` (string) : Détails semelle ("Vibram,EVA,gel")
- `upper` (string) : Matériau tige ("mesh,cuir,synthétique")
- `material` (string) : Matériaux généraux ("textile,caoutchouc")
- `utilisation` (string) : Utilisations ("course,randonnée,fitness")
- `care_instructions` (string) : Instructions d'entretien

### Champs visuels et commercial

- `color` (string) : Couleur principale
- `colors` (string) : Couleurs disponibles ("noir,blanc,rouge")
- `news` (boolean) : Produit nouveau (true/false)
- `is_active` (boolean) : Produit actif (par défaut: true)
- `sales_count` (number) : Nombre de ventes

## Correspondance JSON ↔ SQL

| Champ JSON     | Type JSON | Colonne SQL    | Type SQL     | Notes                 |
| -------------- | --------- | -------------- | ------------ | --------------------- |
| `name`         | string    | `name`         | VARCHAR(150) | **Obligatoire**       |
| `price`        | number    | `price`        | DECIMAL(8,2) | **Obligatoire**       |
| `brand`        | string    | `brand`        | VARCHAR(50)  |                       |
| `sizes`        | number[]  | `sizes`        | SMALLINT[]   | Array PostgreSQL      |
| `gender`       | string    | `gender`       | CHAR(1)      | M/F/U                 |
| `1_star`       | number    | `"1_star"`     | SMALLINT     | Guillemets en SQL     |
| `colors`       | string    | `colors`       | VARCHAR(100) | Séparées par virgules |
| `ground_types` | string    | `ground_types` | VARCHAR(50)  | Séparées par virgules |

## Utilisation

1. **Préparer les images** (optionnel) :

   ```
   backend/temp-images/
   ├── altra-lone-peak-7.webp
   ├── xero-prio-black.webp
   └── ...
   ```

2. **Créer le fichier JSON** :

   ```bash
   cp products-to-add-example.json products-to-add.json
   # Éditez products-to-add.json avec vos produits
   ```

3. **Exécuter le script** :

   ```bash
   cd backend
   npm run script:add-from-json
   ```

4. **Vérifier les résultats** :
   ```bash
   npm run script:show-table
   ```

## Exemples

### Produit minimal

```json
{
  "name": "Chaussure de test",
  "price": 99.99
}
```

### Produit complet

```json
{
  "name": "Altra Lone Peak 7",
  "brand": "Altra",
  "price": 129.95,
  "type": "Trail Running",
  "category": "trail",
  "gender": "U",
  "sizes": [39, 40, 41, 42, 43, 44, 45],
  "description": "Chaussure de trail avec ZeroDrop",
  "image_url": "altra-lone-peak-7.webp",
  "stock": 25,
  "rating": 4.5,
  "review_count": 42,
  "ground_types": "trail,montagne",
  "is_recommended": 1
}
```

## Gestion des erreurs

- **Fichier JSON manquant** : Le script vous indique comment créer le fichier
- **JSON invalide** : Vérifiez la syntaxe (virgules, guillemets, etc.)
- **Champs manquants** : Seuls `name` et `price` sont obligatoires
- **Types incorrects** : Respectez les types (string, number, boolean, array)

## Notes importantes

- Le fichier JSON est automatiquement vidé après un ajout réussi
- Les images locales seront uploadées sur Cloudflare R2 lors de l'ajout
- Le script utilise les valeurs par défaut du schéma SQL pour les champs non fournis
- Les arrays PostgreSQL sont gérés automatiquement (ex: `sizes`)
