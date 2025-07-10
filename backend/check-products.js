const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: false },
});

async function checkProducts() {
  try {
    const result = await pool.query(
      "SELECT COUNT(*) as total, COUNT(CASE WHEN is_active = true THEN 1 END) as active FROM products"
    );
    console.log("📊 Statistiques produits:");
    console.log(`   Total: ${result.rows[0].total}`);
    console.log(`   Actifs: ${result.rows[0].active}`);

    const activeProducts = await pool.query(
      "SELECT id, name, is_active, image_url FROM products ORDER BY id LIMIT 5"
    );
    console.log("\n📋 Premiers produits:");
    activeProducts.rows.forEach((row) => {
      console.log(
        `   ID: ${row.id}, Name: ${row.name}, Active: ${row.is_active}, Image: ${row.image_url}`
      );
    });

    await pool.end();
  } catch (error) {
    console.error("❌ Erreur:", error);
  }
}

checkProducts();
