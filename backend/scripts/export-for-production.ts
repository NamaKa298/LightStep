import { pool } from "../src/db";
import * as fs from "fs";

async function exportData() {
  try {
    console.log("📤 Export des données pour la production...\n");

    // Récupérer tous les produits
    const products = await pool.query("SELECT * FROM products ORDER BY id;");

    console.log(`🎯 ${products.rows.length} produit(s) trouvé(s)\n`);

    // Format pour réimport
    const exportData = {
      timestamp: new Date().toISOString(),
      source: "LightStepdb (développement local)",
      destination: "Base de données de production",
      products: products.rows.map((product) => ({
        name: product.name,
        brand: product.brand,
        price: parseFloat(product.price),
        type: product.type,
        activity: product.activity,
        gender: product.gender,
        size: product.size,
      })),
    };

    // Sauvegarde en JSON
    const exportFile = `export-production-${Date.now()}.json`;
    fs.writeFileSync(exportFile, JSON.stringify(exportData, null, 2));

    console.log("✅ Export terminé !");
    console.log(`📁 Fichier créé : ${exportFile}`);
    console.log("\n📋 Aperçu des données exportées :");
    console.table(exportData.products);

    console.log("\n🚀 ÉTAPES SUIVANTES POUR LE DÉPLOIEMENT :");
    console.log("==========================================");
    console.log(
      "1. Choisir un service de base de données (Heroku, Supabase, etc.)"
    );
    console.log("2. Créer une base de données distante");
    console.log(
      "3. Modifier src/db.ts avec les nouvelles informations de connexion"
    );
    console.log("4. Exécuter npm run init-db pour créer la structure");
    console.log(`5. Importer les données depuis ${exportFile}`);
    console.log("6. Déployer le code sur Vercel/Netlify/Heroku");
  } catch (error) {
    console.error("❌ Erreur lors de l'export :", error);
  } finally {
    await pool.end();
  }
}

exportData();
