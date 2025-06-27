# 📚 Guide complet LightStep - CRUD & API

## 🎯 **Objectif de ce guide**

Ce guide vous permet de **gérer complètement** votre boutique de chaussures LightStep sans aide externe.

---

## 🗂️ **Structure du projet**

```
LightStep/
├── backend/
│   ├── src/
│   │   ├── index.ts          ← Serveur principal
│   │   ├── db.ts             ← Connexion base de données
│   │   └── routes/
│   │       └── products.ts   ← Routes API
│   └── scripts/
│       ├── init-db.ts           ← Créer/reset les tables
│       ├── migrate-full.ts      ← Évolutions de structure
│       ├── add-product-interactive.ts ← Ajouter des produits
│       ├── test-check-table.ts  ← Vérifier structure/données
│       └── test-api.ts          ← Tester l'API
└── frontend/ (Vite/React)
```

---

## 🚀 **Démarrage rapide**

### **1. Lancer le serveur**

```bash
cd backend
npm run dev
```

➡️ Serveur disponible sur `http://localhost:3001`

### **2. Tester que tout fonctionne**

```bash
npm run test-api
```

---

## 🛠️ **Gestion des produits**

### **📊 Voir tous les produits et la structure**

```bash
npm run test-check
```

Affiche en JSON :

- ✅ Structure complète de la table (colonnes, types, contraintes)
- ✅ Contenu de la table (tous les produits)

### **➕ Ajouter des produits (mode interactif)**

```bash
npm run add-interactive
```

Script interactif qui vous guide pour ajouter :

- ✅ Un produit unique
- ✅ Plusieurs produits depuis un fichier JSON

### **🏗️ Créer/Reset la base de données**

```bash
npm run init-db
```

**⚠️ ATTENTION :** Supprime toutes les données existantes !

### **� Faire évoluer la structure (sans perte de données)**

```bash
npm run migrate-full
```

Ajoute de nouvelles colonnes sans supprimer les produits existants.

---

## 🌐 **API REST disponible**

| Méthode  | URL               | Description       | Exemple                 |
| -------- | ----------------- | ----------------- | ----------------------- |
| `GET`    | `/`               | Page d'accueil    | Documentation           |
| `GET`    | `/health`         | État serveur      | Status + timestamp      |
| `GET`    | `/api/products`   | Tous les produits | Liste complète          |
| `GET`    | `/api/products/1` | Produit par ID    | Un seul produit         |
| `POST`   | `/api/products`   | Créer produit     | Envoie données JSON     |
| `PUT`    | `/api/products/1` | Modifier produit  | Met à jour              |
| `DELETE` | `/api/products/1` | Supprimer produit | Supprime définitivement |

### **Exemple d'utilisation depuis le frontend :**

```javascript
// Récupérer tous les produits
const response = await fetch("http://localhost:3001/api/products");
const products = await response.json();

// Ajouter un produit
await fetch("http://localhost:3001/api/products", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    name: "Nouvelle chaussure",
    brand: "Ma marque",
    price: 99.99,
    type: "minimalist_shoes",
    activity: "running",
    gender: "unisex",
    size: [38, 39, 40],
    description: "Description du produit",
    image_url: "https://example.com/image.jpg",
    stock: 10,
  }),
});

// Modifier un produit
await fetch("http://localhost:3001/api/products/1", {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    name: "Nom modifié",
    price: 89.99,
    stock: 5,
    // ... autres champs
  }),
});

// Supprimer un produit
await fetch("http://localhost:3001/api/products/1", {
  method: "DELETE",
});
```

---

## 📝 **Requêtes SQL utiles**

### **Recherches avancées :**

```sql
-- Produits par marque
SELECT * FROM products WHERE brand = 'Vibram Five Fingers';

-- Produits par activité
SELECT * FROM products WHERE activity = 'running';

-- Produits par genre
SELECT * FROM products WHERE gender = 'female';

-- Produits dans une gamme de prix
SELECT * FROM products WHERE price BETWEEN 80 AND 120;

-- Produits disponibles en taille 38
SELECT * FROM products WHERE 38 = ANY(size);

-- Statistiques
SELECT
  COUNT(*) as total,
  AVG(price) as prix_moyen,
  MIN(price) as moins_cher,
  MAX(price) as plus_cher
FROM products;

-- Produits par type
SELECT type, COUNT(*) as quantite
FROM products
GROUP BY type;
```

---

## 🔧 **Maintenance et dépannage**

### **Recréer la base de données**

```bash
npm run init-db
```

### **Vérifier la structure**

```bash
npm run test-check
```

### **En cas de problème de connexion**

1. Vérifiez que PostgreSQL est lancé
2. Vérifiez les paramètres dans `src/db.ts` :

```typescript
export const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "LightStepdb",
  password: "votre_mot_de_passe",
  port: 5432,
});
```

### **Redémarrer le serveur**

```bash
# Dans le terminal du serveur : Ctrl+C puis
npm run dev
```

---

## 🎨 **Personnalisation**

### **Ajouter un nouveau champ à la table**

1. Modifiez `scripts/migrate-full.sql` :

```sql
-- Ajouter une nouvelle colonne
ALTER TABLE products
ADD COLUMN IF NOT EXISTS nouvelle_colonne TEXT;
```

2. Exécutez la migration :

```bash
npm run migrate-full
```

3. Mettez à jour les routes dans `routes/products.ts`

### **Créer une nouvelle table (ex: commandes)**

1. Créez `scripts/init-orders.sql`
2. Créez `routes/orders.ts`
3. Ajoutez la route dans `index.ts`

---

## 📊 **Scripts disponibles**

| Script            | Commande                   | Description                            |
| ----------------- | -------------------------- | -------------------------------------- |
| Serveur dev       | `npm run dev`              | Lance le serveur en mode développement |
| Init DB           | `npm run init-db`          | Initialise/reset la base de données    |
| Migration         | `npm run migrate-full`     | Fait évoluer la structure (sans perte) |
| Ajouter           | `npm run add-interactive`  | Ajoute des produits (mode interactif)  |
| Vérifier          | `npm run test-check`       | Affiche structure + données (JSON)     |
| Test API          | `npm run test-api`         | Teste toutes les routes API            |
| Lister DBs        | `npm run list-db`          | Liste toutes les bases PostgreSQL      |
| Voir localisation | `npm run show-db-location` | Affiche où sont stockées les données   |

---

## 🎯 **Workflow recommandé**

### **Pour ajouter des produits régulièrement :**

1. `npm run add-interactive`
2. Choisissez "Ajouter depuis JSON"
3. Modifiez `scripts/products-to-add.json`
4. `npm run test-api` pour vérifier

### **Pour modifier la structure (nouvelles colonnes) :**

1. Éditez `scripts/migrate-full.sql`
2. `npm run migrate-full`
3. `npm run test-check` pour vérifier

### **Pour vérifier l'état de votre base :**

1. `npm run test-check` (voir structure + données)
2. `npm run list-db` (voir toutes les bases)
3. `npm run test-api` (tester les routes)

---

## 🚨 **Règles importantes**

✅ **À FAIRE :**

- Toujours tester avec `npm run test-api` après des modifications
- Utiliser `npm run migrate-full` pour les évolutions de structure
- Vérifier avec `npm run test-check` avant et après les changements
- Utiliser `npm run add-interactive` pour ajouter des produits

❌ **À ÉVITER :**

- Utiliser `npm run init-db` en production (supprime tout !)
- Modifier directement la base de données sans script
- Lancer plusieurs scripts de base de données en même temps

---

## 🎉 **Vous êtes maintenant autonome !**

Avec ce guide, vous pouvez :

- ✅ Voir la structure et les données en JSON (`npm run test-check`)
- ✅ Ajouter des produits facilement (`npm run add-interactive`)
- ✅ Faire évoluer votre base sans perte (`npm run migrate-full`)
- ✅ Tester votre API (`npm run test-api`)
- ✅ Gérer plusieurs bases PostgreSQL (`npm run list-db`)
- ✅ Diagnostiquer les problèmes rapidement

**Bonne gestion de votre boutique LightStep ! 🏃‍♀️👟**
