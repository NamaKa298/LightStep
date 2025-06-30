import { pool } from "../../src/db";

// 📖 LIRE et RECHERCHER des produits
async function readProducts() {
  try {
    console.log("📖 Lecture des produits...\n");

    // 1️⃣ Tous les produits
    console.log("1️⃣ TOUS LES PRODUITS :");
    const allProducts = await pool.query("SELECT * FROM products ORDER BY id");
    console.table(allProducts.rows);

    // 2️⃣ Recherche par marque
    console.log("\n2️⃣ PRODUITS VIBRAM :");
    const vibramProducts = await pool.query(
      "SELECT * FROM products WHERE brand = $1",
      ["Vibram Five Fingers"]
    );
    console.table(vibramProducts.rows);

    // 3️⃣ Recherche par activité
    console.log("\n3️⃣ CHAUSSURES DE RUNNING :");
    const runningShoes = await pool.query(
      "SELECT * FROM products WHERE activity = $1",
      ["running"]
    );
    console.table(runningShoes.rows);

    // 4️⃣ Recherche par prix
    console.log("\n4️⃣ CHAUSSURES MOINS DE 100€ :");
    const cheapShoes = await pool.query(
      "SELECT * FROM products WHERE price < $1 ORDER BY price",
      [100]
    );
    console.table(cheapShoes.rows);

    // 5️⃣ Recherche par taille
    console.log("\n5️⃣ CHAUSSURES DISPONIBLES EN TAILLE 38 :");
    const size38 = await pool.query(
      "SELECT * FROM products WHERE $1 = ANY(size)",
      [38]
    );
    console.table(size38.rows);

    // 6️⃣ Statistiques
    console.log("\n6️⃣ STATISTIQUES :");
    const stats = await pool.query(`
      SELECT 
        COUNT(*) as total_produits,
        AVG(price) as prix_moyen,
        MIN(price) as prix_min,
        MAX(price) as prix_max
      FROM products
    `);
    console.table(stats.rows);
  } catch (error) {
    console.error("❌ Erreur lors de la lecture :", error);
  } finally {
    await pool.end();
  }
}

readProducts();
