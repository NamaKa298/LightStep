import { pool } from "../src/db";
import * as fs from "fs";
import * as path from "path";

async function showTable() {
  try {
    console.log("📊 Structure de la table products :");

    // Voir la structure
    const structure = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'products' 
      ORDER BY ordinal_position;
    `);

    console.table(structure.rows);

    console.log("\n📋 Contenu de la table products :");

    // Voir le contenu
    const content = await pool.query("SELECT * FROM products;");

    if (content.rows.length === 0) {
      console.log("❌ La table est vide");
    } else {
      console.table(content.rows);

      // Exporter en CSV
      console.log("\n💾 Export en CSV...");

      const csvHeader = Object.keys(content.rows[0]).join(",");
      const csvRows = content.rows.map((row) =>
        Object.values(row)
          .map((value) => {
            // Gérer les arrays et objets
            if (Array.isArray(value)) {
              return `"${JSON.stringify(value)}"`;
            }
            // Échapper les guillemets dans les chaînes
            if (typeof value === "string") {
              return `"${value.replace(/"/g, '""')}"`;
            }
            return value;
          })
          .join(",")
      );

      const csvContent = [csvHeader, ...csvRows].join("\n");

      // Sauvegarder le fichier CSV
      const csvPath = path.join(__dirname, "../exports/products.csv");

      // Créer le dossier exports s'il n'existe pas
      const exportsDir = path.dirname(csvPath);
      if (!fs.existsSync(exportsDir)) {
        fs.mkdirSync(exportsDir, { recursive: true });
      }

      fs.writeFileSync(csvPath, csvContent, "utf8");
      console.log(`✅ CSV sauvegardé : ${csvPath}`);
    }

    console.log(`\n📈 Total produits : ${content.rowCount}`);
  } catch (error) {
    console.error("❌ Erreur :", error);
  } finally {
    await pool.end();
  }
}

showTable();
