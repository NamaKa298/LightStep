import { pool } from "../src/db";
import { readFileSync } from "fs";
import { join } from "path";

async function initDatabase() {
  try {
    console.log("Connecting to database...");

    // Read the SQL file
    const sqlFile = join(process.cwd(), "scripts", "init-db.sql");
    const sql = readFileSync(sqlFile, "utf8");

    // Split by semicolon to execute each statement separately
    const statements = sql.split(";").filter((stmt) => stmt.trim());

    for (const statement of statements) {
      if (statement.trim()) {
        console.log("Executing:", statement.trim().substring(0, 50) + "...");
        await pool.query(statement);
      }
    }

    console.log("Database initialized successfully!");

    // Test query to verify data
    const result = await pool.query("SELECT * FROM products");
    console.log("Products in database:", result.rows);
  } catch (error) {
    console.error("Error initializing database:", error);
  } finally {
    await pool.end();
  }
}

initDatabase();
