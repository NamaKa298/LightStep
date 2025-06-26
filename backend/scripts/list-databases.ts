import { Pool } from "pg";

// Configuration pour se connecter à PostgreSQL
const adminPool = new Pool({
  user: "postgres",
  host: "localhost",
  password: "erreg5grfsgUIGHIYfg!",
  port: 5432,
  database: "postgres",
});

async function listDatabases() {
  try {
    console.log("📊 Connexion à PostgreSQL...");
    
    // Lister toutes les bases de données
    const listQuery = `
      SELECT 
        datname as "Nom de la base",
        pg_size_pretty(pg_database_size(datname)) as "Taille",
        (SELECT count(*) FROM pg_stat_activity WHERE datname = pg_database.datname) as "Connexions actives"
      FROM pg_database 
      WHERE datistemplate = false 
      ORDER BY datname;
    `;
    
    const result = await adminPool.query(listQuery);
    
    console.log("\n🗄️  BASES DE DONNÉES DISPONIBLES :");
    console.table(result.rows);
    
    console.log(`\n📈 Total : ${result.rows.length} base(s) de données`);
    
  } catch (error) {
    console.error("❌ Erreur lors de la liste des bases :", error);
  } finally {
    await adminPool.end();
  }
}

listDatabases();
