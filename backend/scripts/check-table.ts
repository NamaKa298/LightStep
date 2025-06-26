import { pool } from "../src/db";

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
    console.table(result.rows);

    // Vérifier les données existantes
    const data = await pool.query("SELECT * FROM products LIMIT 5");
    console.log("Données existantes :");
    console.table(data.rows);
  } catch (error) {
    console.error("Erreur :", error);
  } finally {
    await pool.end();
  }
}

checkTable();
