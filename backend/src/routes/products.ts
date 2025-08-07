import express from "express";
import { pool } from "../db/db";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

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

    const where: any = {};
    const variantFilters: any = {};

    if (genders) {
      where.gender = {
        name: { in: Array.isArray(genders) ? genders : [genders] },
      };
    }

    if (brands) {
      where.brand = {
        name: { in: Array.isArray(brands) ? brands : [brands] },
      };
    }

    if (sizes) {
      variantFilters.size = {
        eu_size: {
          in: Array.isArray(sizes) ? sizes.map(Number) : [Number(sizes)],
        },
      };
    }

    if (ground_types) {
      where.product_ground_types = {
        some: {
          ground_type: {
            name: {
              in: Array.isArray(ground_types) ? ground_types : [ground_types],
            },
          },
        },
      };
    }

    if (minPrice) {
      variantFilters.price = {
        ...variantFilters.price,
        gte: Number(minPrice),
      };
    }

    if (maxPrice) {
      variantFilters.price = {
        ...variantFilters.price,
        lte: Number(maxPrice),
      };
    }

    if (uses) {
      where.use = {
        name: { in: Array.isArray(uses) ? uses : [uses] },
      };
    }

    if (stability) {
      where.stability = {
        in: Array.isArray(stability) ? stability : [stability],
      };
    }

    if (minDrop) {
      variantFilters.drop = {
        ...variantFilters.drop,
        gte: Number(minDrop),
      };
    }

    if (maxDrop) {
      variantFilters.drop = {
        ...variantFilters.drop,
        lte: Number(maxDrop),
      };
    }

    if (minHeight) {
      variantFilters.height = {
        ...variantFilters.height,
        gte: Number(minHeight),
      };
    }

    if (maxHeight) {
      variantFilters.height = {
        ...variantFilters.height,
        lte: Number(maxHeight),
      };
    }

    if (colors) {
      variantFilters.color = {
        hex_code: { in: Array.isArray(colors) ? colors : [colors] },
      };
    }

    // Ajouter les conditions à la requête
    if (Object.keys(variantFilters).length > 0) {
      where.product_variants = { some: variantFilters };
    }

    // Requête Prisma
    const productVariants = await prisma.productVariant.findMany({
      where: {
        product: where,
      },
      include: {
        product: {
          include: {
            brand: true,
            gender: true,
            use: true,
            product_ground_types: {
              include: { ground_type: true },
            },
          },
        },
        size: true,
        color: true,
      },
      distinct: ["product_id", "color_id"],
      orderBy: [{ product_id: "asc" }, { color_id: "asc" }],
    });

    // Mapper les variantes avec un nom de variable raccourci
    const formattedVariants = productVariants.map((v) => ({
      id: v.id,
      product_id: v.product_id,
      name: v.product?.name ?? null,
      brand: v.product?.brand ?? null,
      price: v.price,
      color_id: v.color_id,
      color_name: v.color?.name ?? null,
      color_hex: v.color?.hex_code ?? null,
      gender: v.product?.gender?.name ?? null,
      use: v.product?.use?.name ?? null,
      rating: v.product?.rating ?? null,
      review_count: v.product?.review_count ?? null,
    }));

    res.json(formattedVariants);
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
