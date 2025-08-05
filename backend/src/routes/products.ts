import express from "express";
import { pool } from "../db/db";

const router = express.Router();

// Récupérer tous les produits
router.get("/", async (req: any, res: any) => {
  try {
    const {
      genders,
      brands,
      sizes,
      ground_types,
      minPrice,
      maxPrice,
      uses,
      stability,
      minDrop,
      maxDrop,
      minHeight,
      maxHeight,
      colors,
    } = req.query;
    let query = `
      SELECT DISTINCT ON (pv.product_id, pv.color_id)
        pv.id,
        p.name,
        pv.price,
        p.rating,
        p.review_count
      FROM product_variants pv
      JOIN products p ON pv.product_id = p.id
      JOIN brands b ON p.brand_id = b.id
      JOIN sizes s ON pv.size_id = s.id
      JOIN colors c ON pv.color_id = c.id
      JOIN genders g ON p.gender_id = g.id
      JOIN product_ground_types pgt ON p.id = pgt.product_id
      JOIN ground_types gt ON pgt.ground_type_id = gt.id
      JOIN uses u ON p.use_id = u.id
    `;

    // Tableaux pour les conditions et les paramètres
    const conditions: string[] = [];
    const params: any[] = [];

    if (genders) {
      const genderList = Array.isArray(genders) ? genders : [genders];
      conditions.push(
        `g.name IN (${genderList
          .map((_, i) => `$${params.length + i + 1}`)
          .join(",")})`
      );
      params.push(...genderList);
    }

    // Ajout des filtres
    if (brands) {
      const brandList = Array.isArray(brands) ? brands : [brands];
      conditions.push(
        `b.name IN (${brandList
          .map((_, i) => `$${params.length + i + 1}`)
          .join(",")})`
      );
      params.push(...brandList);
    }

    if (sizes) {
      const sizeList = Array.isArray(sizes)
        ? sizes.map(Number)
        : [Number(sizes)];
      conditions.push(
        `s.eu_size IN (${sizeList
          .map((_, i) => `$${params.length + i + 1}`)
          .join(",")})`
      );
      params.push(...sizeList);
    }

    if (ground_types) {
      const groundTypeList = Array.isArray(ground_types)
        ? ground_types
        : [ground_types];
      conditions.push(
        `gt.name IN (${groundTypeList
          .map((_, i) => `$${params.length + i + 1}`)
          .join(",")})`
      );
      params.push(...groundTypeList);
    }

    if (minPrice) {
      conditions.push(`pv.price >= $${params.length + 1}`);
      params.push(Number(minPrice));
    }

    if (maxPrice) {
      conditions.push(`pv.price <= $${params.length + 1}`);
      params.push(Number(maxPrice));
    }

    if (uses) {
      const useList = Array.isArray(uses) ? uses : [uses];
      conditions.push(
        `u.name IN (${useList
          .map((_, i) => `$${params.length + i + 1}`)
          .join(",")})`
      );
      params.push(...useList);
    }

    if (stability) {
      const stabilityList = Array.isArray(stability) ? stability : [stability];
      conditions.push(
        `p.stability IN (${stabilityList
          .map((_, i) => `$${params.length + i + 1}`)
          .join(",")})`
      );
      params.push(...stabilityList);
    }

    if (minDrop) {
      conditions.push(`pv.drop >= $${params.length + 1}`);
      params.push(Number(minDrop));
    }

    if (maxDrop) {
      conditions.push(`pv.drop <= $${params.length + 1}`);
      params.push(Number(maxDrop));
    }

    if (minHeight) {
      conditions.push(`pv.height >= $${params.length + 1}`);
      params.push(Number(minHeight));
    }

    if (maxHeight) {
      conditions.push(`pv.height <= $${params.length + 1}`);
      params.push(Number(maxHeight));
    }

    if (colors) {
      const colorList = Array.isArray(colors) ? colors : [colors];
      conditions.push(
        `c.hex_code IN (${colorList
          .map((_, i) => `$${params.length + i + 1}`)
          .join(",")})`
      );
      params.push(...colorList);
    }

    // Ajouter les conditions à la requête
    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(" AND ")}`;
    }

    // Finaliser la requête
    query += `
      GROUP BY p.id, pv.id, b.name
      ORDER BY pv.product_id, pv.color_id
    `;

    const { rows } = await pool.query(query, params);
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
    const [brands, sizes, ground_types, uses, colors, genders] =
      await Promise.all([
        pool.query("SELECT name FROM brands ORDER BY name"),
        pool.query("SELECT DISTINCT eu_size FROM sizes ORDER BY eu_size"),
        pool.query("SELECT name FROM ground_types ORDER BY name"),
        pool.query("SELECT name FROM uses ORDER BY name"),
        pool.query("SELECT name, hex_code FROM colors ORDER BY name"),
        pool.query("SELECT name FROM genders ORDER BY name"),
      ]);

    res.json({
      brands: brands.rows.map((row) => ({ id: row.id, name: row.name })),
      sizes: sizes.rows.map((row) => row.eu_size),
      ground_types: ground_types.rows.map((row) => ({
        id: row.id,
        name: row.name,
      })),
      uses: uses.rows.map((row) => ({
        id: row.id,
        name: row.name,
      })),
      colors: colors.rows.map((row) => ({
        name: row.name,
        hex: row.hex_code,
      })),
      genders: genders.rows.map((row) => ({ id: row.id, name: row.name })),
    });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors du chargement des filtres" });
  }
});

export default router;
