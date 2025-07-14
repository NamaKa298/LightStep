import { pool } from "../src/db";
import { parse } from "csv-parse/sync";
import fs from "fs";

interface Products {
  sale: number;
  name: string;
  brand: string;
  base_price: number;
  weight: number;
  type: string;
  category: string;
  gender: string;
  ground_type: string;
  stability: string;
  drop: string;
  rating: number;
  "1_star": number;
  "2_star": number;
  "3_star": number;
  "4_star": number;
  "5_star": number;
  review_count: number;
  is_recommended: number;
  news: boolean;
  sole_details: string;
  upper: string;
  material: string;
  uses: string;
  care_instructions: string;
  description: string;
}
async function importProducts() {
  const client = await pool.connect();

  try {
    // 1. Lire le fichier CSV
    const csvData = fs.readFileSync("products.csv", "utf8");
    const products: Products[] = parse(csvData, { columns: true });

    for (const p of products) {
      const brand_id = (
        await client.query("SELECT id FROM brands WHERE name = $1", [p.brand])
      ).rows[0]?.id;

      const type_id = (
        await client.query("SELECT id FROM types WHERE name = $1", [p.type])
      ).rows[0]?.id;

      const category_id = (
        await client.query("SELECT id FROM categories WHERE name = $1", [
          p.category,
        ])
      ).rows[0]?.id;

      const gender_id = (
        await client.query("SELECT id FROM genders WHERE name = $1", [p.gender])
      ).rows[0]?.id;

      const ground_type_id = (
        await client.query("SELECT id FROM ground_types WHERE name = $1", [
          p.ground_type,
        ])
      ).rows[0]?.id;

      await client.query(
        `
        INSERT INTO products (
          sale,
          name,
          brand_id,
          base_price,
          weight,
          type_id,
          category_id,
          gender_id,
          ground_type_id,
          stability,
          drop,
          rating,
          "1_star",
          "2_star",
          "3_star",
          "4_star",
          "5_star",
          review_count,
          is_recommended,
          news,
          sole_details,
          upper,
          material,
          uses,
          care_instructions,
          description

        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26)
      `,
        [
          p.sale,
          p.name,
          brand_id,
          p.base_price,
          p.weight,
          type_id,
          category_id,
          gender_id,
          ground_type_id,
          p.stability,
          p.drop,
          p.rating,
          p["1_star"],
          p["2_star"],
          p["3_star"],
          p["4_star"],
          p["5_star"],
          p.review_count,
          p.is_recommended,
          p.news,
          p.sole_details,
          p.upper,
          p.material,
          p.uses,
          p.care_instructions,
          p.description,
        ]
      );

      console.log(`✅ ${p.name} importé`);
    }
  } finally {
    client.release();
    await pool.end();
  }
}

importProducts().catch(console.error);
