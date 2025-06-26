import { pool } from "../src/db";

// 🗑️ SUPPRIMER des produits
async function deleteProducts() {
  try {
    console.log("🗑️ Suppression des produits...\n");

    // 1️⃣ Afficher l'état actuel
    console.log("1️⃣ ÉTAT ACTUEL :");
    const beforeDelete = await pool.query(
      "SELECT id, name, brand FROM products ORDER BY id"
    );
    console.table(beforeDelete.rows);

    // 2️⃣ Supprimer un produit par ID
    console.log("\n2️⃣ SUPPRIMER LE PRODUIT ID 8 (Test Shoe) :");
    const deleteById = await pool.query(
      "DELETE FROM products WHERE id = $1 RETURNING *",
      [8]
    );

    if (deleteById.rows.length > 0) {
      console.log("✅ Produit supprimé :");
      console.table(deleteById.rows);
    } else {
      console.log("❌ Produit non trouvé");
    }

    // 3️⃣ Supprimer par condition (prix trop élevé)
    console.log("\n3️⃣ SUPPRIMER LES PRODUITS > 200€ :");
    const deleteExpensive = await pool.query(
      "DELETE FROM products WHERE price > $1 RETURNING *",
      [200]
    );

    if (deleteExpensive.rows.length > 0) {
      console.log("✅ Produits supprimés :");
      console.table(deleteExpensive.rows);
    } else {
      console.log("ℹ️ Aucun produit > 200€ trouvé");
    }

    // 4️⃣ Supprimer les doublons (même nom ET même marque)
    console.log("\n4️⃣ SUPPRIMER LES DOUBLONS :");
    const deleteDuplicates = await pool.query(`
      DELETE FROM products a USING products b 
      WHERE a.id > b.id 
      AND a.name = b.name 
      AND a.brand = b.brand
      RETURNING a.*
    `);

    if (deleteDuplicates.rows.length > 0) {
      console.log("✅ Doublons supprimés :");
      console.table(deleteDuplicates.rows);
    } else {
      console.log("ℹ️ Aucun doublon trouvé");
    }

    // 5️⃣ ATTENTION : Supprimer TOUS les produits (décommentez si besoin)
    /*
    console.log("\n⚠️ SUPPRIMER TOUS LES PRODUITS (DANGEREUX) :");
    const deleteAll = await pool.query("DELETE FROM products RETURNING *");
    console.log(`🗑️ ${deleteAll.rows.length} produits supprimés`);
    */

    // 6️⃣ État final
    console.log("\n6️⃣ ÉTAT FINAL :");
    const afterDelete = await pool.query("SELECT * FROM products ORDER BY id");
    console.table(afterDelete.rows);
    console.log(`📊 Total restant : ${afterDelete.rows.length} produits`);
  } catch (error) {
    console.error("❌ Erreur lors de la suppression :", error);
  } finally {
    await pool.end();
  }
}

deleteProducts();
