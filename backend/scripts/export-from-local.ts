import { Pool } from "pg";
import * as fs from "fs";
import * as path from "path";

// Configuration pour la base locale
const localPool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "LightStepdb",
  password: "erreg5grfsgUIGHIYfg!",
  port: 5432,
});

async function exportFromLocal() {
  try {
    console.log("📦 Export des données depuis la base locale...");

    // Exporter les produits
    const productsResult = await localPool.query(
      "SELECT * FROM products ORDER BY id"
    );

    if (productsResult.rows.length === 0) {
      console.log("⚠️  Aucun produit trouvé dans la base locale");
      return;
    }

    console.log(
      `✅ ${productsResult.rows.length} produits trouvés dans la base locale`
    );

    // Créer le répertoire exports s'il n'existe pas
    const exportsDir = path.join(__dirname, "../exports");
    if (!fs.existsSync(exportsDir)) {
      fs.mkdirSync(exportsDir, { recursive: true });
    }

    // Sauvegarder en JSON
    const exportData = {
      products: productsResult.rows,
      exportDate: new Date().toISOString(),
      totalProducts: productsResult.rows.length,
    };

    const jsonFilePath = path.join(exportsDir, "local-data-export.json");
    fs.writeFileSync(jsonFilePath, JSON.stringify(exportData, null, 2));

    console.log(`💾 Données exportées vers: ${jsonFilePath}`);
    console.log("📋 Aperçu des données exportées:");
    console.table(
      productsResult.rows.map((row) => ({
        id: row.id,
        name: row.name,
        brand: row.brand,
        price: row.price,
      }))
    );

    await localPool.end();
  } catch (error) {
    console.error("❌ Erreur lors de l'export:", error);
    await localPool.end();
  }
}

exportFromLocal();
