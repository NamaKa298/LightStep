"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const db_1 = require("../db/db");
async function migrateDatabase() {
    try {
        console.log("🔄 Migration de la base de données...");
        // Lire le fichier SQL de migration
        const sqlFile = (0, path_1.join)(process.cwd(), "migrations", "migrate-full.sql");
        const sql = (0, fs_1.readFileSync)(sqlFile, "utf8");
        // Nettoyer le SQL : supprimer tous les commentaires
        let cleanedSql = sql
            // Supprimer les commentaires ligne par ligne
            .split("\n")
            .filter((line) => {
            const trimmed = line.trim();
            return !trimmed.startsWith("--") && trimmed.length > 0;
        })
            .join("\n")
            // Supprimer les commentaires bloc /* */
            .replace(/\/\*[\s\S]*?\*\//g, "");
        // Séparer les instructions SQL
        const statements = cleanedSql
            .split(";")
            .map((stmt) => stmt.trim())
            .filter((stmt) => {
            // Garder seulement les instructions non vides
            return stmt.length > 0 && !stmt.match(/^\s*$/);
        });
        console.log("🔌 Connexion à PostgreSQL pour migration...");
        console.log(`📝 Instructions SQL trouvées : ${statements.length}`);
        statements.forEach((stmt, index) => {
            console.log(`${index + 1}. ${stmt.substring(0, 50)}...`);
        });
        for (const statement of statements) {
            if (statement.trim()) {
                console.log("\n🔄 Executing:", statement.trim().substring(0, 60) + "...");
                try {
                    await db_1.pool.query(statement);
                    console.log("✅ Success!");
                }
                catch (error) {
                    // Ignorer les erreurs de contrainte qui existe déjà
                    if (error.code === "42710") {
                        // constraint already exists
                        console.log("⚠️  Constraint already exists, skipping...");
                    }
                    else {
                        throw error; // Re-lancer les autres erreurs
                    }
                }
            }
        }
        console.log("✅ Migration terminée avec succès !");
        // Vérifier la structure après migration
        console.log("\n🏗️  Structure des tables après migration :");
        const tablesQuery = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `;
        const tables = await db_1.pool.query(tablesQuery);
        console.table(tables.rows);
    }
    catch (error) {
        console.error("❌ Erreur lors de la migration :", error);
    }
    finally {
        await db_1.pool.end();
    }
}
migrateDatabase();
