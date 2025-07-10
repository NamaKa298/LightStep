# LightStep Backend

## 🎯 Vue d'ensemble

Backend professionnel pour la boutique de chaussures LightStep avec gestion optimisée des images et du stock par taille.

## ⚡ Démarrage rapide

### 1. Installation

```bash
npm install
```

### 2. Configuration

- Copier `.env.example` vers `.env`
- Configurer les variables de base de données (Neon)
- Configurer les variables Cloudflare R2

### 3. Initialisation de la base

```bash
npm run init-db
```

### 4. Import de produits

```bash
# Placer les images dans temp-images/
# Modifier scripts/products-to-add.json
npm run add-json
```

## 📋 Scripts disponibles

### Import et gestion des produits

- `npm run add-json` - Import depuis JSON avec upload automatique
- `npm run add-interactive` - Ajout interactif de produits
- `npm run show-table` - Visualisation des données + export CSV

### Gestion des images

- `npm run upload-images` - Upload manuel vers R2
- `npm run clean-images` - Nettoyage des images temporaires

### Base de données

- `npm run init-db` - Initialisation des tables
- `npm run migrate-full` - Migration et mises à jour

### Serveur

- `npm run dev` - Serveur de développement
- `npm run build` - Build de production
- `npm run start` - Serveur de production

## 🏗️ Architecture

### Optimisations clés

1. **Images optimisées** : Stockage des noms uniquement, reconstruction dynamique des URLs
2. **Stock par taille** : Tableaux synchronisés `sizes[]` et `stock[]`
3. **Upload automatique** : Intégration Cloudflare R2 dans le workflow d'import
4. **Base de données robuste** : PostgreSQL avec Neon en cloud

### Structure des données produit

```json
{
  "name": "Nom du produit",
  "price": 129.99,
  "brand": "Marque",
  "image_url": "nom-image.webp",
  "sizes": [40, 41, 42, 43, 44],
  "stock": [5, 8, 12, 6, 3],
  "type": "Type",
  "category": "Catégorie",
  "gender": "U",
  "description": "Description"
}
```

## 📖 Documentation complète

Voir `WORKFLOW-PRODUIT-PRO.md` pour la documentation complète du workflow de production.

## 🔧 Technologies

- **Backend** : Node.js + TypeScript + Express
- **Base de données** : PostgreSQL (Neon)
- **Stockage images** : Cloudflare R2
- **ORM** : Pool de connexions PostgreSQL natif
- **Upload** : AWS SDK v3 (compatible S3)

## 🎉 Fonctionnalités

✅ Import JSON automatisé avec upload d'images  
✅ Gestion du stock par taille  
✅ Interface d'ajout interactif  
✅ Upload Cloudflare R2 intégré  
✅ Reconstruction dynamique des URLs d'images  
✅ Export CSV automatique  
✅ Migration et mise à jour du schéma  
✅ Nettoyage automatique des fichiers temporaires

## 🚀 Prêt pour la production

Le backend est entièrement configuré et testé pour un environnement de production avec une architecture scalable et des bonnes pratiques respectées.
