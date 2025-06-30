import { pool } from "../src/db";

async function showDatabaseLocation() {
  try {
    console.log("🔍 Recherche de l'emplacement de la base de données...\n");

    // Informations de connexion
    console.log("📡 INFORMATIONS DE CONNEXION :");
    console.log("================================");
    console.log("Host     :", "localhost");
    console.log("Port     :", "5432");
    console.log("Database :", "LightStepdb");
    console.log("User     :", "postgres");

    // Emplacement physique
    console.log("\n💾 EMPLACEMENT PHYSIQUE :");
    console.log("==========================");

    const dataDir = await pool.query("SHOW data_directory;");
    console.log("Dossier des données :", dataDir.rows[0].data_directory);

    // Informations sur la base
    console.log("\n📊 INFORMATIONS SUR LA BASE :");
    console.log("===============================");

    const dbInfo = await pool.query(`
      SELECT 
        datname as "Nom de la base",
        pg_size_pretty(pg_database_size(datname)) as "Taille",
        datconnlimit as "Limite connexions"
      FROM pg_database 
      WHERE datname = 'LightStepdb';
    `);

    console.table(dbInfo.rows);

    // Informations sur la table products
    console.log("\n📋 INFORMATIONS SUR LA TABLE PRODUCTS :");
    console.log("=========================================");

    const tableInfo = await pool.query(`
      SELECT 
        schemaname as "Schéma",
        tablename as "Table",
        tableowner as "Propriétaire",
        pg_size_pretty(pg_total_relation_size('products')) as "Taille totale"
      FROM pg_tables 
      WHERE tablename = 'products';
    `);

    console.table(tableInfo.rows);

    // Nombre de produits
    const count = await pool.query("SELECT COUNT(*) as total FROM products;");
    console.log(
      `\n🎯 CONTENU : ${count.rows[0].total} produit(s) dans la table`
    );
  } catch (error) {
    console.error("❌ Erreur :", error);
  } finally {
    await pool.end();
  }
}

showDatabaseLocation();
