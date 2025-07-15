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

interface ProductCategory {
  name: string;
  category: string;
}

interface ProductGroundType {
  name: string;
  ground_type: string;
}

async function importProducts() {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1. Importer les produits
    const csvData = fs.readFileSync("seed_data/products.csv", "utf8");
    const products: Products[] = parse(csvData, { columns: true });

    for (const p of products) {
      const existingProduct = await client.query(
        "SELECT id FROM products WHERE name = $1",
        [p.name]
      );

      if (existingProduct.rows.length > 0) {
        console.log(`⏩ Skipping (le produit existe déjà): ${p.name}`);
        continue;
      }

      const brand_id = (
        await client.query("SELECT id FROM brands WHERE name = $1", [p.brand])
      ).rows[0]?.id;

      const type_id = (
        await client.query("SELECT id FROM types WHERE name = $1", [p.type])
      ).rows[0]?.id;

      const gender_id = (
        await client.query("SELECT id FROM genders WHERE name = $1", [p.gender])
      ).rows[0]?.id;

      const productInsert = await client.query(
        `
        INSERT INTO products (
          sale, name, brand_id, base_price, weight, type_id, gender_id,
          stability, drop, rating, "1_star", "2_star", "3_star", "4_star",
          "5_star", review_count, is_recommended, news, sole_details, upper,
          material, uses, care_instructions, description
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24)
        RETURNING id
        `,
        [
          p.sale,
          p.name,
          brand_id,
          p.base_price,
          p.weight,
          type_id,
          gender_id,
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
      const productId = productInsert.rows[0].id;
      console.log(`✅ ${p.name} importé (ID: ${productId})`);
    }

    // 2. Importer les associations produits-catégories
    const csvCategoriesData = fs.readFileSync(
      "seed_data/product_categories.csv",
      "utf8"
    );
    const categories: ProductCategory[] = parse(csvCategoriesData, {
      columns: true,
    });

    for (const c of categories) {
      // Récupérer l'ID de la catégorie
      const categoryRes = await client.query(
        "SELECT id FROM categories WHERE name = $1",
        [c.category]
      );
      const category_id = categoryRes.rows[0]?.id;

      // Récupérer l'ID du produit
      const productRes = await client.query(
        "SELECT id FROM products WHERE name = $1",
        [c.name]
      );
      const product_id = productRes.rows[0]?.id;

      if (category_id && product_id) {
        // Vérifier si l'association existe déjà
        const existingLink = await client.query(
          "SELECT 1 FROM product_categories WHERE product_id = $1 AND category_id = $2",
          [product_id, category_id]
        );

        if (existingLink.rows.length === 0) {
          await client.query(
            "INSERT INTO product_categories (product_id, category_id) VALUES ($1, $2)",
            [product_id, category_id]
          );
          console.log(`   ↳ Catégorie assignée: ${c.category} à ${c.name}`);
        }
      } else {
        if (!category_id)
          console.warn(`⚠️ Catégorie non trouvée: ${c.category}`);
        if (!product_id) console.warn(`⚠️ Produit non trouvé: ${c.name}`);
      }
    }

    await client.query("COMMIT");
    console.log("🎉 Import terminé avec succès!");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Erreur lors de l'import:", err);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

importProducts().catch(console.error);
