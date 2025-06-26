import { pool } from "../src/db";

async function recreateTable() {
  try {
    console.log("Suppression de l'ancienne table...");
    await pool.query("DROP TABLE IF EXISTS products");

    console.log("Création de la nouvelle table...");
    await pool.query(`
      CREATE TABLE products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        brand VARCHAR(50),
        price DECIMAL(10,2) NOT NULL,
        size INTEGER[],
        type VARCHAR(50),
        activity VARCHAR(50),
        gender VARCHAR(10)
      );
    `);

    console.log("Table recréée avec succès !");

    // Ajouter votre produit
    console.log("Ajout du produit...");
    const result = await pool.query(
      `
      INSERT INTO products (name, brand, price, type, activity, gender, size) 
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `,
      [
        "Five Fingers EL-X Knit Femme",
        "Vibram Five Fingers",
        125.0,
        "minimalist_shoes",
        "gym",
        "female",
        [36, 38, 39],
      ]
    );

    console.log("Produit ajouté :", result.rows[0]);
  } catch (error) {
    console.error("Erreur :", error);
  } finally {
    await pool.end();
  }
}

recreateTable();
