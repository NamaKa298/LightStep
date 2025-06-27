import { pool } from "../../src/db";

async function checkTable() {
  try {
    console.log("Vérification de la structure de la table...");

    const result = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'products' 
      ORDER BY ordinal_position;
    `);

    console.log("Structure de la table products :");
    console.log(JSON.stringify(result.rows, null, 2));

    // Vérifier les données existantes
    const data = await pool.query("SELECT * FROM products LIMIT 5");
    console.log("\nDonnées existantes :");
    console.log(JSON.stringify(data.rows, null, 2));
  } catch (error) {
    console.error("Erreur :", error);
  } finally {
    await pool.end();
  }
}

checkTable();
