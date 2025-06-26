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
│       ├── crud-create.ts    ← Créer des produits
│       ├── crud-read.ts      ← Lire/rechercher
│       ├── crud-update.ts    ← Modifier des produits
│       ├── crud-delete.ts    ← Supprimer des produits
│       └── test-api.ts       ← Tester l'API
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

### **📊 Voir tous les produits**

```bash
npm run crud-read
```

### **➕ Ajouter UN produit**

1. Éditez `scripts/crud-create.ts`
2. Modifiez l'objet `newProduct` :

```typescript
const newProduct = {
  name: "Nom de la chaussure",
  brand: "Marque",
  price: 99.99,
  type: "minimalist_shoes", // ou "zero_drop", "barefoot"
  activity: "running", // ou "gym", "trail", "casual"
  gender: "unisex", // ou "male", "female"
  size: [36, 37, 38, 39, 40], // tailles disponibles
};
```

3. Exécutez : `npm run crud-create`

### **➕ Ajouter PLUSIEURS produits**

1. Éditez `scripts/add-multiple-products.ts`
2. Ajoutez vos produits dans le tableau `newProducts`
3. Exécutez : `npm run add-multiple`

### **✏️ Modifier un produit**

1. Éditez `scripts/crud-update.ts`
2. Changez les valeurs dans les exemples
3. Exécutez : `npm run crud-update`

### **🗑️ Supprimer des produits**

1. Éditez `scripts/crud-delete.ts`
2. Modifiez les ID ou conditions
3. Exécutez : `npm run crud-delete`

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
  }),
});

// Modifier un produit
await fetch("http://localhost:3001/api/products/1", {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    name: "Nom modifié",
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
npx ts-node scripts/check-table.ts
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

1. Modifiez `scripts/init-db.sql` :

```sql
ALTER TABLE products ADD COLUMN description TEXT;
```

2. Mettez à jour les routes dans `routes/products.ts`
3. Ajoutez le champ dans vos scripts CRUD

### **Créer une nouvelle table (ex: commandes)**

1. Créez `scripts/init-orders.sql`
2. Créez `routes/orders.ts`
3. Ajoutez la route dans `index.ts`

---

## 📊 **Scripts disponibles**

| Script      | Commande               | Description                            |
| ----------- | ---------------------- | -------------------------------------- |
| Serveur dev | `npm run dev`          | Lance le serveur en mode développement |
| Init DB     | `npm run init-db`      | Initialise la base de données          |
| Créer       | `npm run crud-create`  | Ajoute un produit                      |
| Multiple    | `npm run add-multiple` | Ajoute plusieurs produits              |
| Lire        | `npm run crud-read`    | Affiche tous les produits + recherches |
| Modifier    | `npm run crud-update`  | Modifie des produits                   |
| Supprimer   | `npm run crud-delete`  | Supprime des produits                  |
| Test API    | `npm run test-api`     | Teste toutes les routes API            |

---

## 🎯 **Workflow recommandé**

### **Pour ajouter des produits régulièrement :**

1. Éditez `scripts/add-multiple-products.ts`
2. Ajoutez vos nouveaux produits dans le tableau
3. `npm run add-multiple`
4. `npm run test-api` pour vérifier

### **Pour modifier des prix (soldes, etc.) :**

1. Éditez `scripts/crud-update.ts`
2. Modifiez les requêtes selon vos besoins
3. `npm run crud-update`

### **Pour nettoyer la base :**

1. `npm run crud-delete` (supprime les doublons, tests, etc.)
2. `npm run crud-read` pour vérifier

---

## 🚨 **Règles importantes**

✅ **À FAIRE :**

- Toujours tester avec `npm run test-api` après des modifications
- Sauvegarder la base avant des suppressions importantes
- Utiliser des scripts plutôt que des commandes SQL directes

❌ **À ÉVITER :**

- Modifier directement la base de données sans script
- Supprimer tous les produits sans sauvegarde
- Lancer plusieurs scripts en même temps

---

## 🎉 **Vous êtes maintenant autonome !**

Avec ce guide, vous pouvez :

- ✅ Ajouter/modifier/supprimer des produits
- ✅ Gérer votre base de données
- ✅ Tester votre API
- ✅ Dépanner les problèmes courants
- ✅ Étendre les fonctionnalités

**Bonne gestion de votre boutique LightStep ! 🏃‍♀️👟**
