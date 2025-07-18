import express from "express";
import { pool } from "../db";

const router = express.Router();

// Récupérer tous les produits
router.get("/", async (req: any, res: any) => {
  try {
    const { rows } = await pool.query(`
      SELECT DISTINCT ON (pv.product_id, pv.color_id)
        p.name,
        pv.price,
        p.rating,
        p.review_count
      FROM product_variants pv
      JOIN products p ON pv.product_id = p.id
    `);

    res.json(rows);
  } catch (error) {
    console.error("Erreur lors de la récupération:", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des produits" });
  }
});

router.get("/filters", async (req, res) => {
  try {
    const [brands, sizes, ground_types, uses, colors] = await Promise.all([
      pool.query("SELECT DISTINCT name FROM brands ORDER BY name"),
      pool.query("SELECT DISTINCT eu_size FROM sizes ORDER BY eu_size"),
      pool.query("SELECT DISTINCT name FROM ground_types ORDER BY name"),
      pool.query("SELECT DISTINCT name FROM uses ORDER BY name"),
      pool.query("SELECT DISTINCT name, hex_code FROM colors ORDER BY name"),
    ]);

    res.json({
      brands: brands.rows,
      sizes: sizes.rows.map((r) => r.eu_size),
      ground_types: ground_types.rows,
      uses: uses.rows,
      colors: colors.rows,
    });
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;
