import express from "express";
import { pool } from "../db";
import { addImageUrlsToProducts } from "../image-utils";

const router = express.Router();

// Ajouter un produit
router.post("/", async (req: any, res: any) => {
  try {
    const { name, brand, price, size, type, activity, gender } = req.body;
    const { rows } = await pool.query(
      `INSERT INTO products (name, brand, price, size, type, activity, gender) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [name, brand, price, size, type, activity, gender]
    );
    res.json(rows[0]);
  } catch (error) {
    console.error("Erreur lors de l'ajout:", error);
    res.status(500).json({ error: "Erreur lors de l'ajout du produit" });
  }
});

// Récupérer tous les produits
router.get("/", async (req: any, res: any) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM products WHERE is_active = true ORDER BY id"
    );

    // Convertir les ratings et review_count en nombres
    const productsWithNumericRatings = rows.map((product) => ({
      ...product,
      rating: product.rating ? parseFloat(product.rating) : null,
      review_count: product.review_count
        ? parseInt(product.review_count)
        : null,
    }));

    // 🚀 AJOUT : Reconstruire automatiquement les URLs d'images
    console.log("🔧 Reconstruction des URLs d'images...");
    const productsWithUrls = addImageUrlsToProducts(productsWithNumericRatings);
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

// Récupérer un produit par ID
router.get("/:id", async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query("SELECT * FROM products WHERE id = $1", [
      id,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Produit non trouvé" });
    }

    // Convertir les ratings en nombres
    const product = {
      ...rows[0],
      rating: rows[0].rating ? parseFloat(rows[0].rating) : null,
      review_count: rows[0].review_count
        ? parseInt(rows[0].review_count)
        : null,
    };

    res.json(product);
  } catch (error) {
    console.error("Erreur lors de la récupération:", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération du produit" });
  }
});

// Modifier un produit
router.put("/:id", async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { name, brand, price, size, type, activity, gender } = req.body;

    const { rows } = await pool.query(
      `UPDATE products 
       SET name = $1, brand = $2, price = $3, size = $4, type = $5, activity = $6, gender = $7 
       WHERE id = $8 
       RETURNING *`,
      [name, brand, price, size, type, activity, gender, id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Produit non trouvé" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Erreur lors de la modification:", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la modification du produit" });
  }
});

// Supprimer un produit
router.delete("/:id", async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      "DELETE FROM products WHERE id = $1 RETURNING *",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Produit non trouvé" });
    }

    res.json({ message: "Produit supprimé avec succès", product: rows[0] });
  } catch (error) {
    console.error("Erreur lors de la suppression:", error);
    res.status(500).json({ error: "Erreur lors de la suppression du produit" });
  }
});

export default router;
