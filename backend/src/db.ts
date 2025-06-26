import { Pool } from "pg";

export const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "LightStepdb",
  password: "erreg5grfsgUIGHIYfg!",
  port: 5432,
});

console.log("Trying to connect with:", {
  user: "postgres",
  host: "localhost",
  database: "LightStepdb",
});
