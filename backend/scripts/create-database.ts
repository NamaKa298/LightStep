import { Pool } from "pg";

// Configuration pour se connecter à PostgreSQL (sans spécifier de database)
const adminPool = new Pool({
  user: "postgres",
  host: "localhost",
  password: "erreg5grfsgUIGHIYfg!",
  port: 5432,
  // Se connecter à la base par défaut pour créer une nouvelle base
  database: "postgres",
});

async function createDatabase() {
  const databaseName = process.argv[2];
  
  if (!databaseName) {
    console.log("❌ Erreur : Vous devez spécifier un nom de base de données");
    console.log("💡 Usage : npm run create-db <nom_de_la_base>");
    console.log("📝 Exemple : npm run create-db MonNouveauProjet");
    process.exit(1);
  }

  try {
    console.log(`🔄 Création de la base de données '${databaseName}'...`);
    
    // Vérifier si la base existe déjà
    const checkQuery = `
      SELECT 1 FROM pg_database WHERE datname = $1;
    `;
    const checkResult = await adminPool.query(checkQuery, [databaseName]);
    
    if (checkResult.rows.length > 0) {
      console.log(`⚠️  La base de données '${databaseName}' existe déjà !`);
      return;
    }

    // Créer la nouvelle base de données
    // Note: Les paramètres ne fonctionnent pas avec CREATE DATABASE
    const createQuery = `CREATE DATABASE "${databaseName}";`;
    await adminPool.query(createQuery);
    
    console.log(`✅ Base de données '${databaseName}' créée avec succès !`);
    
    // Lister toutes les bases de données
    console.log("\n📊 Bases de données disponibles :");
    const listQuery = `
      SELECT datname as "Nom de la base" 
      FROM pg_database 
      WHERE datistemplate = false 
      ORDER BY datname;
    `;
    const listResult = await adminPool.query(listQuery);
    console.table(listResult.rows);
    
  } catch (error) {
    console.error("❌ Erreur lors de la création de la base :", error);
  } finally {
    await adminPool.end();
  }
}

createDatabase();
