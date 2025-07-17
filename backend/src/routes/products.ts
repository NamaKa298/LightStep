import express from "express";
import { pool } from "../db";
import { addImageUrlsToProductVariants } from "../image-utils";

const router = express.Router();

// Récupérer tous les produits
router.get("/", async (req: any, res: any) => {
  try {
    const { rows } =
      await pool.query(`SELECT DISTINCT ON (product_id, color_id) * FROM product_variants
      JOIN products ON product_variants.product_id = products.id`);

    // 🚀 AJOUT : Reconstruire automatiquement les URLs d'images
    console.log("🔧 Reconstruction des URLs d'images...");
    const productsWithUrls = addImageUrlsToProductVariants(rows);
    console.log(
      "✅ URLs reconstruites, exemple:",
      productsWithUrls[0]?.image_url_full
    );

    res.json(productsWithUrls);
  } catch (error) {
    console.error("Erreur lors de la récupération:", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des produits" });
  }
});

export default router;
