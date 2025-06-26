import { pool } from "../src/db";

// 🆕 CRÉER un nouveau produit
async function createProduct() {
  try {
    console.log("🆕 Création d'un nouveau produit...");

    // Définissez votre produit ici
    const newProduct = {
      name: "Vibram FiveFingers V-Train 2.0",
      brand: "Vibram",
      price: 149.99,
      type: "minimalist_shoes",
      activity: "gym",
      gender: "unisex",
      size: [38, 39, 40, 41, 42],
    };

    const query = `
      INSERT INTO products (name, brand, price, type, activity, gender, size) 
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;

    const result = await pool.query(query, [
      newProduct.name,
      newProduct.brand,
      newProduct.price,
      newProduct.type,
      newProduct.activity,
      newProduct.gender,
      newProduct.size,
    ]);

    console.log("✅ Produit créé avec succès :");
    console.log(result.rows[0]);
  } catch (error) {
    console.error("❌ Erreur lors de la création :", error);
  } finally {
    await pool.end();
  }
}

createProduct();
