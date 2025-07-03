import { pool } from "../src/db";
import * as fs from "fs";
import * as path from "path";

async function setupNeonAndImport() {
  try {
    console.log("🚀 Configuration de Neon et import des données...");

    // Étape 1: Créer la table products sur Neon
    console.log("📋 Création de la table products...");
    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        brand VARCHAR(50),
        price DECIMAL(10,2) NOT NULL,
        size INTEGER[],
        type VARCHAR(50),
        activity VARCHAR(50),
        gender VARCHAR(10),
        image_url TEXT,
        stock INTEGER DEFAULT 0,
        description TEXT,
        rating NUMERIC DEFAULT 0.0,
        review_count INTEGER DEFAULT 0,
        images TEXT[],
        color VARCHAR(50),
        colors TEXT[],
        news BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Étape 2: Créer la table categories
    console.log("📋 Création de la table categories...");
    await pool.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        sizes INTEGER[],
        colors TEXT[],
        news BOOLEAN,
        genders TEXT[],
        brands TEXT[],
        activities TEXT[],
        min_price INTEGER DEFAULT 50,
        max_price INTEGER DEFAULT 200,
        drops NUMERIC[],
        grounds TEXT[],
        types TEXT[],
        weights NUMERIC[],
        stabilities TEXT[],
        uses TEXT[],
        min_rating DECIMAL DEFAULT 0.0,
        max_rating DECIMAL DEFAULT 5.0
      );
    `);

    // Étape 3: Vérifier que les données exportées existent
    const exportFilePath = path.join(
      __dirname,
      "../exports/local-data-export.json"
    );
    if (!fs.existsSync(exportFilePath)) {
      console.log(
        "❌ Fichier d'export introuvable. Exécutez d'abord export-from-local.ts"
      );
      return;
    }

    // Étape 4: Charger et importer les données
    console.log("📥 Chargement des données exportées...");
    const exportData = JSON.parse(fs.readFileSync(exportFilePath, "utf-8"));

    console.log(`📊 ${exportData.products.length} produits à importer`);

    // Étape 5: Vider la table products sur Neon (au cas où)
    await pool.query("DELETE FROM products");

    // Étape 6: Insérer les produits un par un
    for (const product of exportData.products) {
      await pool.query(
        `
        INSERT INTO products (
          name, brand, price, size, type, activity, gender, 
          image_url, stock, description, rating, review_count,
          images, color, colors, news
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      `,
        [
          product.name,
          product.brand,
          product.price,
          product.size,
          product.type,
          product.activity,
          product.gender,
          product.image_url,
          product.stock,
          product.description,
          product.rating,
          product.review_count,
          product.images,
          product.color,
          product.colors,
          product.news,
        ]
      );
    }

    console.log("✅ Import terminé !");

    // Étape 7: Vérifier l'import
    const result = await pool.query("SELECT COUNT(*) as count FROM products");
    console.log(`📈 Total produits sur Neon: ${result.rows[0].count}`);

    // Afficher quelques produits pour vérifier
    const sample = await pool.query(
      "SELECT id, name, brand, price FROM products LIMIT 3"
    );
    console.log("📋 Échantillon des produits importés:");
    console.table(sample.rows);

    await pool.end();
  } catch (error) {
    console.error("❌ Erreur:", error);
    await pool.end();
  }
}

setupNeonAndImport();
