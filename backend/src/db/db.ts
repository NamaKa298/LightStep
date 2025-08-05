import { Pool } from "pg";
import * as dotenv from "dotenv";

// Charger les variables d'environnement
dotenv.config();

export const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || "5432"),
  ssl: process.env.DB_HOST?.includes("neon")
    ? { rejectUnauthorized: false }
    : false,
});

console.log("Trying to connect with:", {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
});
