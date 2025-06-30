import { pool } from "../src/db";
import * as fs from "fs";
import * as path from "path";

interface Product {
  name: string;
  brand: string;
  price: number;
  type: string;
  activity: string;
  gender: string;
  size: number[];
  description?: string;
  image_url?: string;
  images?: string[];
  stock?: number;
  rating?: number;
  review_count?: number;
  color?: string;
  colors?: string[];
  news?: boolean; // Ajout de la propriété news
}

async function addFromJSON() {
  try {
    const jsonPath = path.join(__dirname, "products-to-add.json");

    if (!fs.existsSync(jsonPath)) {
      console.log("❌ Fichier products-to-add.json non trouvé !");
      console.log("💡 Créez le fichier avec vos produits à ajouter.");
      return;
    }

    const jsonData = fs.readFileSync(jsonPath, "utf8");
    const products: Product[] = JSON.parse(jsonData);

    if (products.length === 0) {
      console.log("⚠️  Aucun produit dans le fichier JSON.");
      return;
    }

    console.log(
      `🚀 Ajout de ${products.length} produit(s) depuis le fichier JSON...\n`
    );

    const query = `
      INSERT INTO products (name, brand, price, type, activity, gender, size, description, image_url, images, stock, rating, review_count, color, colors) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING *;
    `;

    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      console.log(`➕ Ajout ${i + 1}/${products.length}: ${product.name}`);

      const values = [
        product.name,
        product.brand,
        product.price,
        product.type,
        product.activity,
        product.gender,
        product.size,
        product.description || null,
        product.image_url || null,
        product.images || null,
        product.stock || 0,
        product.rating || 0.0,
        product.review_count || 0,
        product.color || null,
        product.colors || null,
      ];

      const result = await pool.query(query, values);
      console.log(`✅ ID: ${result.rows[0].id}\n`);
    }

    // Vider le fichier après ajout
    fs.writeFileSync(jsonPath, "[]", "utf8");
    console.log("🧹 Fichier JSON vidé après ajout.");

    console.log("📋 Produits ajoutés avec succès !");
  } catch (error) {
    console.error("❌ Erreur :", error);
  } finally {
    await pool.end();
  }
}

addFromJSON();
