import { pool } from "../../src/db";

// ✏️ MODIFIER des produits
async function updateProducts() {
  try {
    console.log("✏️ Modification des produits...\n");

    // 1️⃣ Modifier le prix d'un produit spécifique
    console.log("1️⃣ MODIFIER LE PRIX D'UN PRODUIT :");
    const updatePrice = await pool.query(
      `UPDATE products 
       SET price = $1 
       WHERE id = $2 
       RETURNING *`,
      [99.99, 1] // Nouveau prix 99.99€ pour le produit ID 1
    );

    if (updatePrice.rows.length > 0) {
      console.log("✅ Prix modifié :");
      console.table(updatePrice.rows);
    } else {
      console.log("❌ Produit non trouvé");
    }

    // 2️⃣ Ajouter des tailles à un produit
    console.log("\n2️⃣ AJOUTER DES TAILLES :");
    const addSizes = await pool.query(
      `UPDATE products 
       SET size = ARRAY[35, 36, 37, 38, 39, 40, 41, 42] 
       WHERE id = $1 
       RETURNING *`,
      [2] // Produit ID 2
    );

    if (addSizes.rows.length > 0) {
      console.log("✅ Tailles modifiées :");
      console.table(addSizes.rows);
    }

    // 3️⃣ Modifier plusieurs champs à la fois
    console.log("\n3️⃣ MODIFIER PLUSIEURS CHAMPS :");
    const updateMultiple = await pool.query(
      `UPDATE products 
       SET price = $1, activity = $2, gender = $3 
       WHERE id = $4 
       RETURNING *`,
      [129.99, "trail", "unisex", 3] // Nouveau prix, activité et genre
    );

    if (updateMultiple.rows.length > 0) {
      console.log("✅ Produit mis à jour :");
      console.table(updateMultiple.rows);
    }

    // 4️⃣ Modifier par condition (tous les produits d'une marque)
    console.log("\n4️⃣ APPLIQUER UNE REMISE À TOUS LES PRODUITS XERO :");
    const discountXero = await pool.query(
      `UPDATE products 
       SET price = price * 0.9 
       WHERE brand = $1 
       RETURNING id, name, price`,
      ["Xero Shoes"] // 10% de remise
    );

    if (discountXero.rows.length > 0) {
      console.log("✅ Remise appliquée :");
      console.table(discountXero.rows);
    }

    // 5️⃣ Afficher le résultat final
    console.log("\n5️⃣ ÉTAT FINAL DE TOUS LES PRODUITS :");
    const finalState = await pool.query("SELECT * FROM products ORDER BY id");
    console.table(finalState.rows);
  } catch (error) {
    console.error("❌ Erreur lors de la modification :", error);
  } finally {
    await pool.end();
  }
}

updateProducts();
